import type { Network, RedPacketInput, Account, UserOp, Token } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { isNativeCoin, isWrappedCoin, isStableCoin } from "@/configs/tokens";

import { genDeployAuthProof } from "@/services/web3/oracle";
import { hash, toEthBigNumber } from "@/services/web3/utils";
import { getProvider } from "@/services/web3/network";
import { sendTransaction, estimateGas } from "@/services/web3/wallet";

import ERC20_ABI from "@/configs/abi/ERC20.json";
import RED_PACKET_ABI from "@/configs/abi/HappyRedPacket.json";
import HEXLINK_ABI from "@/configs/abi/Hexlink.json";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import USERS from "@/configs/users.json";
import { useWalletStore } from "@/stores/wallet";

import { BigNumber } from "bignumber.js";

const erc20Iface = new ethers.utils.Interface(ERC20_ABI);
const redPacketIface = new ethers.utils.Interface(RED_PACKET_ABI);

export function hexlinkAddress(network: Network) : string {
    return network.contracts.hexlink as string;
}

export function refund(network: Network) : string {
    return network.contracts.refund as string;
}

export function hexlinkContract(network: Network) {
    return new ethers.Contract(
        hexlinkAddress(network),
        HEXLINK_ABI,
        getProvider(network)
    );
}

function calculateUsdCost(
    network: Network,
    gasAmount: EthBigNumber,
    gasToken: Token
) : EthBigNumber {
    const normalizedUsd = new BigNumber(2).pow(
        gasToken.metadata.decimals
    ).times(network.nativeCurrency.priceInUsd);
    const nativeCoinBase = EthBigNumber.from(2).pow(network.nativeCurrency.decimals);
    return toEthBigNumber(normalizedUsd).mul(gasAmount).div(nativeCoinBase);
}

export function redPacketOps(network: Network, input: RedPacketInput) : UserOp[] {
    const redPacketAddr = network.contracts.redPacket as string;
    const balance = new BigNumber(2).pow(
        input.data.token.metadata.decimals
    ).times(input.data.balance);
    const packet = {
       token: input.data.token.metadata.address,
       salt: hash(new Date().toISOString()),
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
    const fee = await getProvider().getFeeData();
    const gasPrice = fee.gasPrice || network.defaultGasPrice;
    const gasAmout = EthBigNumber.from(2).mul(150000).mul(input.data.split);
    if (isNativeCoin(network, input.data.gasToken)) {
        return {
            to: refund(network),
            value: gasPrice.mul(gasAmout),
            callData: "",
            callGasLimit: EthBigNumber.from(0) // no limit
        };
    } else if (isWrappedCoin(network, input.data.gasToken)) {
        return {
            to: input.data.gasToken.metadata.address,
            value: EthBigNumber.from(0),
            callData: erc20Iface.encodeFunctionData(
                "transfer", [refund(network), gasPrice.mul(gasAmout)]
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
    if (input.data.payGasForClaimers) {
        ops.push(await serviceFeeOp(network, input));
    }

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

export async function estimateDeployAndCreateRedPacket(
    network: Network,
    input: RedPacketInput
) {
    const txParams = await buildDeployAndCreateRedPacketTx(network, input);
    const txGasCost = EthBigNumber.from(await estimateGas(txParams));
    const sponsorshipAmount = EthBigNumber.from(2).mul(150000).mul(input.data.split);

    const fee = await getProvider().getFeeData();
    const gasPrice = fee.gasPrice || network.defaultGasPrice;
    const gasToken = input.data.gasToken;
    if (isNativeCoin(network, gasToken) || isWrappedCoin(network, gasToken)) {
        const sponsorship = gasPrice.mul(sponsorshipAmount);
        const currentTx = gasPrice.mul(txGasCost);
        return {
            sponsorship,
            currentTx,
            total: sponsorship.add(currentTx)
        };
    } else if (isStableCoin(network, gasToken)) {
        const sponsorship = calculateUsdCost(network, sponsorshipAmount, gasToken);
        const currentTx = calculateUsdCost(network, txGasCost, gasToken);
        return {
            sponsorship,
            currentTx,
            total: sponsorship.add(currentTx)
        };
    }
    throw new Error("Unsupported gas token");
}

export async function deployAndCreateRedPacket(
    network: Network,
    input: RedPacketInput
) {
    const txParams = await buildDeployAndCreateRedPacketTx(network, input);
    return await sendTransaction(txParams);
}