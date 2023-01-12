import type { Network, RedPacketInput, Account, UserOp, Token } from "@/types";
import { ethers, BigNumber } from "ethers";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";

import { genDeployAuthProof } from "@/services/web3/oracle";
import { hash, toEthBigNumber } from "@/services/web3/utils";
import { getProvider } from "@/services/web3/network";
import { signMessage } from "@/services/web3/wallet";

import ERC20_ABI from "@/configs/abi/ERC20.json";
import RED_PACKET_ABI from "@/configs/abi/HappyRedPacket.json";
import HEXLINK_ABI from "@/configs/abi/Hexlink.json";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import CONTRACTS from "@/configs/contracts.json";
import USERS from "@/configs/users.json";
import { useWalletStore } from "@/stores/wallet";

const erc20Iface = new ethers.utils.Interface(ERC20_ABI);
const redPacketIface = new ethers.utils.Interface(RED_PACKET_ABI);

export function hexlink(network: Network) {
    const address = (CONTRACTS as any)[network.name].hexlink;
    return new ethers.Contract(
        address,
        HEXLINK_ABI,
        getProvider(network)
    );
}

export function tokenApproveOp(
    token: Token,
    operator: Account,
    amount: BigNumber
) : UserOp {
    return {
        to: token.metadata.address,
        value: BigNumber.from(0),
        callData: erc20Iface.encodeFunctionData(
            "approve", [
                operator.address,
                amount
            ]
        ),
        callGasLimit: BigNumber.from(0) // no limit
    }
}

export function redPacketOps(network: Network, input: RedPacketInput) : UserOp[] {
   const redPacketAddr = (CONTRACTS as any)[network.name].redPacket;
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
    tokenApproveOp(input.data.token, redPacketAddr, packet.balance),
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

export function gasSponsorshipOp(
    network: Network,
    costEsitmation: BigNumber
) : UserOp {
    const wrappedCoin = (CONTRACTS as any)[network.name].wrappedCoin;
    const redPacketAddr = (CONTRACTS as any)[network.name].redPacket;
    return {
        to: wrappedCoin,
        value: BigNumber.from(0),
        callData: erc20Iface.encodeFunctionData(
            "approve", [
                redPacketAddr,
                BigNumber.from(costEsitmation)
            ]
        ),
        callGasLimit: BigNumber.from(0) // no limit
    }
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
        if (isNativeCoin(input.data.token)) {
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
        if (isNativeCoin(input.data.token)) {
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
    if (input.gasSponsorshipCostEstimation) {
        ops.push(gasSponsorshipOp(network, input.gasSponsorshipCostEstimation));
    }

    const account = useProfileStore().account!;
    const accountIface = new ethers.utils.Interface(ACCOUNT_ABI);
    const opData = accountIface.encodeFunctionData("execBatch", [ops]);
    const nonce = BigNumber.from(0);
    const requestId = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["bytes", "uint256"],
            [opData, nonce]
        )
    );
    const signature = await signMessage(account.address, requestId);
    const txData = accountIface.encodeFunctionData(
        "validateAndCall",
        [opData, nonce, signature]
    );
    const { initData, proof } = await genDeployAuthProof(network);
    await hexlink(network).deploy(
        useAuthStore().user!.nameHash,
        initData,
        txData,
        proof
    );
}