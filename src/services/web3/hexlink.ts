import type { Network, RedPacketInput, Account, UserOp, Token } from "@/types";
import { ethers, BigNumber } from "ethers";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";

import { genDeployAuthProof } from "@/services/web3/oracle";
import { hash } from "@/services/web3/utils";
import { getProvider } from "@/services/web3/network";
import { signMessage } from "@/services/web3/wallet";

import ERC20_ABI from "@/configs/abi/ERC20.json";
import RED_PACKET_ABI from "@/configs/abi/HappyRedPacket.json";
import HEXLINK_ABI from "@/configs/abi/Hexlink.json";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import HEXLINK_HELPER_ABI from "@/configs/abi/HexlinkHelper.json";
import CONTRACTS from "@/configs/contracts.json";
import USERS from "@/configs/users.json";
import { useWalletStore } from "@/stores/wallet";

const erc20Iface = new ethers.utils.Interface(ERC20_ABI);
const redPacketIface = new ethers.utils.Interface(RED_PACKET_ABI);
const accountIface = new ethers.utils.Interface(ACCOUNT_ABI);

export function hexlink(network: Network) {
    const address = (CONTRACTS as any)[network.name].hexlink;
    return new ethers.Contract(
        address,
        HEXLINK_ABI,
        getProvider(network)
    );
}

export function hexlinkHelper(network: Network) {
    const address = (CONTRACTS as any)[network.name].hexlinkHelper;
    return new ethers.Contract(
        address,
        HEXLINK_HELPER_ABI,
        getProvider(network)
    );
}

export function redPacketOps(network: Network, input: RedPacketInput) : UserOp[] {
   const redPacketAddr = (CONTRACTS as any)[network.name].redPacket;
   const packet = {
       token: input.data.token.metadata.address,
       salt: hash(new Date().toISOString()),
       balance: input.data.balance,
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
            "approve", [
                redPacketAddr,
                BigNumber.from(input.data.balance.toString(10))
            ]
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

export function refundGasOp(account: Account, amount: BigNumber) : UserOp {
    return {
        to: account.address,
        value: BigNumber.from(0),
        callData: accountIface.encodeFunctionData(
            "refundGas", [
                USERS.gasRefund,
                ethers.constants.AddressZero,
                amount,
                0,
            ]
        ),
        callGasLimit: BigNumber.from(0) // no limit
    }
}

export function tokenTransferOp(
    from: Account,
    to: Account,
    token: Token,
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
    let ops : UserOp[] = [];
    if (input.walletAccount) {
        ops.push(tokenTransferOp(
            walletAccount,
            hexlAccount,
            input.data.token,
            input.walletAccount.tokenAmount
        ));
        ops.push(tokenTransferOp(
            walletAccount,
            hexlAccount,
            input.data.gasToken,
            input.walletAccount.gasTokenAmount
        ));
    }
    ops = ops.concat(redPacketOps(network, input));
    if (input.gasSponsorshipCostEstimation) {
        ops.push(gasSponsorshipOp(network, input.gasSponsorshipCostEstimation));
    }
    const account = useProfileStore().account!;
    ops.push(refundGasOp(account, BigNumber.from(0)));

    const accountIface = new ethers.utils.Interface(ACCOUNT_ABI);
    const data = accountIface.encodeFunctionData("execBatch", [ops]);
    const nonce = BigNumber.from(0);
    const requestId = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["bytes", "uint256"],
            [data, nonce]
        )
    );
    const signature = await signMessage(account.address, requestId);
    const txData = accountIface.encodeFunctionData(
        "validateAndCall",
        [data, nonce, signature]
    );
    const { initData, proof } = await genDeployAuthProof(network);
    await hexlinkHelper(network).deployAndCreateRedPacket(
        useAuthStore().user!.nameHash,
        initData,
        txData,
        proof
    );
}