import type { Network, Account, UserOp, Token, RedPacket } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { isNativeCoin, isWrappedCoin, isStableCoin } from "@/configs/tokens";

import { genDeployAuthProof } from "@/web3/oracle";
import { hash, toEthBigNumber, tokenBase } from "@/web3/utils";
import { hexlinkContract, refund } from "@/web3/hexlink";
import { sendTransaction } from "@/web3/wallet";

import ERC20_ABI from "@/configs/abi/ERC20.json";
import RED_PACKET_ABI from "@/configs/abi/HappyRedPacket.json";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import USERS from "@/configs/users.json";
import { useWalletStore } from "@/stores/wallet";
import { insertRedPacket, updateRedPacket } from "@/graphql/redpacket";
import { BigNumber } from "bignumber.js";

const erc20Iface = new ethers.utils.Interface(ERC20_ABI);
const redPacketIface = new ethers.utils.Interface(RED_PACKET_ABI);

function calcUsdCost(
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
        return calcUsdCost(network, sponsorshipGasAmount, gasToken);
    }
    throw new Error("Unsupported gas token");
}

export function calcTokenAmount(
    redpacket: RedPacket
) : EthBigNumber {
    const base = new BigNumber(10).pow(redpacket.token.metadata.decimals);
    return toEthBigNumber(base.times(redpacket.balance));
}

export function redPacketOps(
    network: Network,
    input: RedPacket
) : UserOp[] {
    const redPacketAddr = network.addresses.redPacket as string;
    const packet = {
       token: input.token.metadata.address,
       salt: input.salt,
       balance: calcTokenAmount(input),
       validator: USERS.redPacketValidator,
       split: input.split,
       mode: input.mode == "random" ? 2 : 1
    };
    if (isNativeCoin(network, input.token)) {
        return [{
            to: redPacketAddr,
            value: packet.balance,
            callData: redPacketIface.encodeFunctionData(
                "create", [packet]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        }];
    } else {
        return [{
            to: input.token.metadata.address,
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
        }];
    }
}

export async function buildDeployAndCreateRedPacketTx(
    network: Network,
    input: RedPacket,
    useHexlinkAccount: boolean
) : Promise<any> {
    const walletAccount = useWalletStore().wallet!.account;
    const hexlAccount = useProfileStore().profile!.account;
    let value : EthBigNumber = EthBigNumber.from(0);
    let ops : UserOp[] = [];
    const from = useHexlinkAccount ? hexlAccount : walletAccount;

    const tokenAmount = calcTokenAmount(input);
    if (!useHexlinkAccount) {
        if (isNativeCoin(network, input.token)) {
            value = value.add(tokenAmount);
        } else {
            ops.push({
                to: input.token.metadata.address,
                value: EthBigNumber.from(0),
                callData: erc20Iface.encodeFunctionData(
                    "transferFrom", [
                        from.address,
                        hexlAccount.address,
                        tokenAmount
                    ]
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            });
        }
    }

    const gasTokenAmout = estimateGasSponsorship(network, input);
    if (isNativeCoin(network, input.gasToken)) {
        value = value.add(gasTokenAmout);
        ops.push({
            to: refund(network),
            value: gasTokenAmout,
            callData: [],
            callGasLimit: EthBigNumber.from(0) // no limit
        });
    } else {
        ops.push({
            to: input.gasToken.metadata.address,
            value: EthBigNumber.from(0),
            callData: erc20Iface.encodeFunctionData(
                "transferFrom", [
                    from.address,
                    refund(network),
                    gasTokenAmout
                ]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        });
    }
    ops = ops.concat(redPacketOps(network, input));
    const accountIface = new ethers.utils.Interface(ACCOUNT_ABI);
    const opsData = accountIface.encodeFunctionData("execBatch", [ops]);
    const { initData, proof } = await genDeployAuthProof(network, opsData);
    const hexlink = hexlinkContract(network);
    const data = hexlink.interface.encodeFunctionData(
        "deploy", [useAuthStore().user!.nameHash, initData, {
            authType: hash(proof.authType),
            identityType: hash(proof.identityType),
            issuedAt: EthBigNumber.from(proof.issuedAt),
            signature: proof.signature
        }]
    );
    return {
        to: hexlink.address,
        from: walletAccount.address,
        value: ethers.utils.hexValue(value),
        data,
    };
}

function redpacketId(network: Network, input: RedPacket) {
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["uint256", "address", "address", "address", "bytes32"],
            [
                network.chainId,
                network.addresses.redPacket,
                useProfileStore().account.address,
                input.token.metadata.address,
                input.salt
            ]
        )
    )
}

export async function deployAndCreateRedPacket(
    network: Network,
    redpacket: RedPacket,
    useHexlinkAccount: boolean
) {
    const txParams = await buildDeployAndCreateRedPacketTx(
        network,
        redpacket,
        useHexlinkAccount
    );
    const id = redpacketId(network, redpacket);
    await insertRedPacket([{
        id,
        chain: network.name,
        metadata: {
            token: redpacket.token.metadata.address,
            salt: redpacket.salt,
            split: redpacket.split,
            balance: redpacket.balance,
            mode: redpacket.mode,
            validator: network.addresses.validator as string,
            expiredAt: 0,
            contract: network.addresses.redPacket as string
        }
    }]);
    const tx = await sendTransaction(txParams);
    await updateRedPacket({id, tx});
}
