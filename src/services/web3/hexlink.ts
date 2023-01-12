import type { Network, RedPacketInput, Account, UserOp, Token } from "@/types";
import { ethers, BigNumber } from "ethers";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { isNativeCoin, isWrappedCoin, isStableCoin } from "@/configs/tokens";

import { genDeployAuthProof } from "@/services/web3/oracle";
import { hash, toEthBigNumber } from "@/services/web3/utils";
import { getProvider } from "@/services/web3/network";
import { sendTransaction } from "@/services/web3/wallet";

import ERC20_ABI from "@/configs/abi/ERC20.json";
import RED_PACKET_ABI from "@/configs/abi/HappyRedPacket.json";
import HEXLINK_ABI from "@/configs/abi/Hexlink.json";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import USERS from "@/configs/users.json";
import { useWalletStore } from "@/stores/wallet";

import { BigNumber as BigNumberJs } from "bignumber.js";
import { ErrorCode } from "@ethersproject/logger";

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
    gasAmount: BigNumber,
    gasToken: Token
) : BigNumber {
    const normalizedUsd = new BigNumberJs(2).pow(
        gasToken.metadata.decimals
    ).times(network.nativeCurrency.priceInUsd);
    const nativeCoinBase = BigNumber.from(2).pow(network.nativeCurrency.decimals);
    return toEthBigNumber(normalizedUsd).mul(gasAmount).div(nativeCoinBase);
}

export function redPacketOps(network: Network, input: RedPacketInput) : UserOp[] {
   const redPacketAddr = network.contracts.redPacket as string;
   const packet = {
       token: input.data.token.metadata.address,
       salt: hash(new Date().toISOString()),
       balance: toEthBigNumber(input.data.balance),
       validator: USERS.redPacketValidator,
       expiredAt: 0,
       split: input.data.split,
       mode: input.data.mode == "random" ? 2 : 1
   };
   return [
    {
        to: input.data.token.metadata.address,
        value: BigNumber.from(0),
        callData: erc20Iface.encodeFunctionData(
            "approve", [redPacketAddr, packet.balance]
        ),
        callGasLimit: BigNumber.from(0) // no limit
    },
    {
        to: redPacketAddr,
        value: BigNumber.from(0),
        callData: redPacketIface.encodeFunctionData(
            "create", [packet]
        ),
        callGasLimit: BigNumber.from(0) // no limit
    }
   ];
}

export async function serviceFeeOp(
    network: Network,
    input: RedPacketInput
) : Promise<UserOp> {
    const fee = await getProvider().getFeeData();
    const gasPrice = fee.gasPrice || network.defaultGasPrice;
    const gasAmout = BigNumber.from(2).mul(150000).mul(input.data.split);
    if (isNativeCoin(network, input.data.gasToken)) {
        return {
            to: refund(network),
            value: gasPrice.mul(gasAmout),
            callData: "",
            callGasLimit: BigNumber.from(0) // no limit
        };
    } else if (isWrappedCoin(network, input.data.gasToken)) {
        return {
            to: input.data.gasToken.metadata.address,
            value: BigNumber.from(0),
            callData: erc20Iface.encodeFunctionData(
                "transfer", [refund(network), gasPrice.mul(gasAmout)]
            ),
            callGasLimit: BigNumber.from(0) // no limit
        };
    } else if (isStableCoin(network, input.data.gasToken)) {
        return {
            to: input.data.gasToken.metadata.address,
            value: BigNumber.from(0),
            callData: erc20Iface.encodeFunctionData(
                "transfer", [
                    refund(network),
                    calculateUsdCost(network, gasAmout, input.data.gasToken)
                ]
            ),
            callGasLimit: BigNumber.from(0) // no limit
        };
    }
    throw new Error("Unsupported gas token");
}

export function tokenTransferOp(
    token: Token,
    from: Account,
    to: Account,
    amount: BigNumber
) : UserOp {
    return {
        to: token.metadata.address,
        value: BigNumber.from(0),
        callData: erc20Iface.encodeFunctionData(
            "transferFrom", [
                from.address,
                to.address,
                amount
            ]
        ),
        callGasLimit: BigNumber.from(0) // no limit
    }
}

export async function deployAndCreateRedPacket(
    network: Network,
    input: RedPacketInput
) {
    const walletAccount = useWalletStore().wallet!.account;
    const hexlAccount = useProfileStore().profile!.account;
    let value : BigNumber = BigNumber.from(0);
    let ops : UserOp[] = [];
    const tokenAmount = input.walletAccount?.tokenAmount || BigNumber.from(0);
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

    const gasTokenAmount = input.walletAccount?.gasTokenAmount || BigNumber.from(0);
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
    await sendTransaction(
        walletAccount.address,
        value,
        hexlink.address,
        data
    );
}