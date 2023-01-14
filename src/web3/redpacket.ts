import type { Network, RedPacketInput, Account, UserOp, Token, RedPacket } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { isNativeCoin, isWrappedCoin, isStableCoin } from "@/configs/tokens";

import { genDeployAuthProof } from "@/web3/oracle";
import { toEthBigNumber, tokenBase } from "@/web3/utils";
import { hexlinkContract, refund } from "@/web3/hexlink";

import ERC20_ABI from "@/configs/abi/ERC20.json";
import RED_PACKET_ABI from "@/configs/abi/HappyRedPacket.json";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import USERS from "@/configs/users.json";
import { useWalletStore } from "@/stores/wallet";
import { insertRedPacket } from "@/graphql/redpacket";

const erc20Iface = new ethers.utils.Interface(ERC20_ABI);
const redPacketIface = new ethers.utils.Interface(RED_PACKET_ABI);

function calculateUsdCost(
    network: Network,
    gasAmount: EthBigNumber,
    gasToken: Token
) : EthBigNumber {
    const normalizedUsd = tokenBase(gasToken).times(network.nativeCurrency.priceInUsd);
    const nativeCoinBase = EthBigNumber.from(10).pow(network.nativeCurrency.decimals);
    return toEthBigNumber(normalizedUsd).mul(gasAmount).mul(
        network.defaultGasPrice
    ).div(nativeCoinBase);
}

export function estimateGasSponsorship(
    network: Network,
    redpacket: RedPacket
) : EthBigNumber {
    const sponsorshipGasAmount = EthBigNumber.from(redpacket.split).mul(200000);
    const gasToken = redpacket.gasToken;
    if (isNativeCoin(network, gasToken) || isWrappedCoin(network, gasToken)) {
        return sponsorshipGasAmount.mul(network.defaultGasPrice);
    } else if (isStableCoin(network, gasToken)) {
        return calculateUsdCost(network, sponsorshipGasAmount, gasToken);
    }
    throw new Error("Unsupported gas token");
}

export function redPacketOps(network: Network, input: RedPacketInput) : UserOp[] {
    const redPacketAddr = network.contracts.redPacket as string;
    const balance = tokenBase(input.data.token).times(input.data.balance);
    const packet = {
       token: input.data.token.metadata.address,
       salt: input.data.salt,
       balance: toEthBigNumber(balance),
       validator: USERS.redPacketValidator,
       expiredAt: 0,
       split: input.data.split,
       mode: input.data.mode == "random" ? 2 : 1
    };
    return [
        {
            to: input.data.token.metadata.address,
            value: EthBigNumber.from(0),
            callData: erc20Iface.encodeFunctionData(
                "approve", [redPacketAddr, packet.balance]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        },
        {
            to: redPacketAddr,
            value: EthBigNumber.from(0),
            callData: redPacketIface.encodeFunctionData(
                "create", [packet]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        }
    ];
}

export async function serviceFeeOp(
    network: Network,
    input: RedPacketInput
) : Promise<UserOp> {
    const gasAmout = EthBigNumber.from(2).mul(150000).mul(input.data.split);
    if (isNativeCoin(network, input.data.gasToken)) {
        return {
            to: refund(network),
            value: gasAmout.mul(network.defaultGasPrice),
            callData: [],
            callGasLimit: EthBigNumber.from(0) // no limit
        };
    } else if (isWrappedCoin(network, input.data.gasToken)) {
        return {
            to: input.data.gasToken.metadata.address,
            value: EthBigNumber.from(0),
            callData: erc20Iface.encodeFunctionData(
                "transfer", [refund(network), gasAmout.mul(network.defaultGasPrice)]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        };
    } else if (isStableCoin(network, input.data.gasToken)) {
        return {
            to: input.data.gasToken.metadata.address,
            value: EthBigNumber.from(0),
            callData: erc20Iface.encodeFunctionData(
                "transfer", [
                    refund(network),
                    calculateUsdCost(network, gasAmout, input.data.gasToken)
                ]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        };
    }
    throw new Error("Unsupported gas token");
}

export function tokenTransferOp(
    token: Token,
    from: Account,
    to: Account,
    amount: EthBigNumber
) : UserOp {
    return {
        to: token.metadata.address,
        value: EthBigNumber.from(0),
        callData: erc20Iface.encodeFunctionData(
            "transferFrom", [
                from.address,
                to.address,
                amount
            ]
        ),
        callGasLimit: EthBigNumber.from(0) // no limit
    }
}

export async function buildDeployAndCreateRedPacketTx(
    network: Network,
    input: RedPacketInput
) : Promise<any> {
    const walletAccount = useWalletStore().wallet!.account;
    const hexlAccount = useProfileStore().profile!.account;
    let value : EthBigNumber = EthBigNumber.from(0);
    let ops : UserOp[] = [];
    const tokenAmount = input.walletAccount?.tokenAmount || EthBigNumber.from(0);
    if (tokenAmount.gt(0)) {
        if (isNativeCoin(network, input.data.token)) {
            value.add(tokenAmount);
        } else {
            ops.push(tokenTransferOp(
                input.data.token,
                walletAccount,
                hexlAccount,
                tokenAmount
            ));
        }
    }

    const gasTokenAmount = input.walletAccount?.gasTokenAmount || EthBigNumber.from(0);
    if (gasTokenAmount.gt(0)) {
        if (isNativeCoin(network, input.data.gasToken)) {
            value.add(gasTokenAmount);
        } else {
            ops.push(tokenTransferOp(
                input.data.gasToken,
                walletAccount,
                hexlAccount,
                gasTokenAmount
            ));
        }
    }

    ops = ops.concat(redPacketOps(network, input));
    ops.push(await serviceFeeOp(network, input));
    const accountIface = new ethers.utils.Interface(ACCOUNT_ABI);
    const opsData = accountIface.encodeFunctionData("execBatch", [ops]);
    const { initData, proof } = await genDeployAuthProof(network, opsData);
    const hexlink = hexlinkContract(network);
    const data = hexlink.interface.encodeFunctionData(
        "deploy", [useAuthStore().user!.nameHash, initData, proof]
    );
    return {
        to: hexlink.address, // Required except during contract publications.
        from: walletAccount.address, // must match user's active address.
        value: value.toHexString(), // Only required to send ether to the recipient from the initiating external account.
        data, // Optional, but used for defining smart contract creation and interaction.
    };
}

function toRedPacketMetadata(rp: RedPacket) {
    return {
        token: rp.token.metadata.address,
        salt: rp.salt,
        split: rp.split,
        balance: rp.balance,
        mode: rp.mode,
        validator: "0x030ffbc193c3f9f4c6378beb506eecb0933fd457",
        expiredAt: 0,
    }
}

export async function deployAndCreateRedPacket(
    network: Network,
    input: RedPacketInput
) {
    const txParams = await buildDeployAndCreateRedPacketTx(network, input);
    // store redpacket into hasura 
    await insertRedPacket([{
        id: "test_id",
        metadata: toRedPacketMetadata(input.data)
    }]);
    //return await sendTransaction(txParams);
}
