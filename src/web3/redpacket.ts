import type { RedPacketDB, RedPacketOnchainState } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useAuthStore } from "@/stores/auth";
import { useTokenStore } from "@/stores/token";

import { genDeployAuthProof } from "@/web3/oracle";
import { tokenEqual } from "@/web3/utils";
import { estimateGas, sendTransaction, signMessage } from "@/web3/wallet";

import type { Op, OpInput, Chain, UserOpRequest } from "../../functions/common";
import {
    hash,
    isNativeCoin,
    erc20Interface,
    erc20Contract,
    getChain,
    hexlAddress,
    hexlInterface,
    accountContract,
    encodeValidateAndCall,
    gasTokenPricePerGwei,
    encodeExecBatch,
    refunder,
} from "../../functions/common";
import type { RedPacketInput } from "../../functions/redpacket";
import {
    redPacketContract,
    buildGasSponsorshipOp,
    buildRedPacketOps,
} from "../../functions/redpacket";

import { useChainStore } from "@/stores/chain";
import { useWalletStore } from "@/stores/wallet";
import { useAccountStore } from "@/stores/account";

import { getFunctions, httpsCallable } from 'firebase/functions'
const functions = getFunctions();

export interface Transaction {
    name: string,
    function: string,
    args: {[key: string]: any},
    input: TransactionInput
}

export interface TransactionInput {
    to: string,
    from: string,
    value: string,
    data: string | [],
}

export function validator() : string {
    if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR) {
        return "0xEF2e3F91209F88A3143e36Be10D52502162426B3";
    }
    return "0x030ffbc193c3f9f4c6378beb506eecb0933fd457";
}

function buildOpInput(params: {
    to: string,
    value?: EthBigNumber,
    callData?: string | [],
    callGasLimit?: EthBigNumber,
}) : OpInput {
    if (!params.value && !params.callData) {
        throw new Error("Neither value or data is set");
    }
    return {
        to: params.to,
        value: params.value || EthBigNumber.from(0),
        callData: params.callData || [],
        callGasLimit: params.callGasLimit || EthBigNumber.from(0),
    }
}

async function buildApproveTx(
    token: string,
    owner: string,
    operator: string,
    requiredAmount: EthBigNumber | string,
) : Promise<Transaction[]> {
    const erc20 = erc20Contract(useChainStore().provider, token);
    const allowance = await erc20.allowance(owner, operator);
    if (allowance.gte(requiredAmount)) {
        return [];
    }
    const data = erc20Interface.encodeFunctionData(
        "approve", [operator, ethers.constants.MaxInt256]
    );
    return [{
        name: "approveHexlAccount",
        function: "approve",
        args: {operator, amount: ethers.constants.MaxInt256},
        input: {
            to: token,
            from: owner,
            data,
            value: ethers.utils.hexValue(0),
        }
    }];
}

async function buildDepositErc20TokenOp(
    token: string,
    from: string,
    to: string,
    amount: EthBigNumber | string
): Promise<{tx: Transaction[], op: Op[]}> {
    const callData = erc20Interface.encodeFunctionData(
        "transferFrom", [from, to, amount]
    );
    return {
        tx: await buildApproveTx(token, from, to, amount),
        op: [{
            name: "depositErc20",
            function: "transferFrom",
            args: {from, to, amount},
            input: buildOpInput({to: token, callData}),
        }]
    }
}

async function buildCreateRedPacketTxForMetamask(input: RedPacketInput) {
    const walletAccount = useWalletStore().account!.address;
    const hexlAccount = useAccountStore().account!.address;
    const chain = useChainStore().chain;

    let userOps : Op[] = [];
    let txes : any[] = [];
    let value : EthBigNumber = EthBigNumber.from(0);

    if (tokenEqual(input.token, input.gasToken)) {
        if (isNativeCoin(input.token, chain)) {
            value = value.add(input.balance!).add(input.gasSponsorship!)
        } else {
            const {tx, op} = await buildDepositErc20TokenOp(
                input.token,
                walletAccount,
                hexlAccount,
                EthBigNumber.from(input.gasSponsorship).add(input.balance),
            );
            txes = txes.concat(tx);
            userOps = userOps.concat(op);
        }
    } else {
        if (isNativeCoin(input.token, chain)) {
            value = value.add(input.balance!);
        } else {
            const {tx, op} = await buildDepositErc20TokenOp(
                input.token,
                walletAccount,
                hexlAccount,
                input.balance
            );
            txes = txes.concat(tx);
            userOps = userOps.concat(op);
        }
        if (isNativeCoin(input.gasToken, chain)) {
            value = value.add(input.gasSponsorship!);
        } else {
            const {tx, op} = await buildDepositErc20TokenOp(
                input.gasToken,
                walletAccount,
                hexlAccount,
                input.gasSponsorship!
            );
            txes = txes.concat(tx);
            userOps = userOps.concat(op);
        }
    }
 
    userOps.push(buildGasSponsorshipOp(hexlAccount, refunder(chain), input));
    userOps = userOps.concat(buildRedPacketOps(chain, input));
    txes.push({
        name: "createRedPacket",
        function: "execBatch",
        args: {ops: userOps},
        input: {
            to: useAccountStore().account!.address,
            from: useWalletStore().account!.address,
            value: ethers.utils.hexValue(value),
            data: encodeExecBatch(userOps.map(op => op.input))
        }
    });
    return txes;
}

export async function buildDeployAndCreateRedPacketTx(input: RedPacketInput) : Promise<any> {
    const txes = await buildCreateRedPacketTxForMetamask(input);
    const tx = txes.pop();

    const { initData, proof } = await genDeployAuthProof(tx.input.data);
    const name = useAuthStore().user!.nameHash;
    const authProof = {
        authType: hash(proof.authType),
        identityType: hash(proof.identityType),
        issuedAt: EthBigNumber.from(proof.issuedAt),
        signature: proof.signature
    };
    const data = hexlInterface.encodeFunctionData(
        "deploy", [name, initData, authProof]
    );
    const hexlAddr = hexlAddress(useChainStore().chain);
    txes.push({
        name: "createRedPacket",
        function: "execBatch",
        deploy: true,
        args: {
            name: useAuthStore().user!.nameHash,
            initData: {
                owner: useWalletStore().account!.address,
                data: tx.args.ops
            },
            authProof,
        },
        input: {
            to: hexlAddr,
            from: useWalletStore().account!.address,
            value: tx.input.value,
            data,
        }
    });
    return txes;
}

async function processTxAndSave(
    redpacket: RedPacketInput,
    txes: any[],
    dryrun: boolean
) : Promise<{id: string, opId?: number}> {
    const chain = useChainStore().chain;
    if (dryrun) {
        for (let i = 0; i < txes.length; i++) {
            const gasUsed = await estimateGas(txes[i].tx);
            console.log({
                tx: txes[i],
                gasUsed: EthBigNumber.from(gasUsed).toString()
            })
        }
        return {id: redpacket.id!};
    }

    for (let i = 0; i < txes.length; i++) {
        const txHash = await sendTransaction(txes[i].input);
        if (txes[i].name == "createRedPacket") {
            const opId = await callCreateRedPacket(chain, redpacket, txHash);
            return {id: redpacket.id!, opId};
        }
    }
    return {id: redpacket.id!};
}

export async function deployAndCreateNewRedPacket(
    redpacket: RedPacketInput,
    useHexlinkAccount: boolean,
    dryrun: boolean = false
) {
    if (useHexlinkAccount) {
        throw new Error("Not supported");
    }
    const txes = await buildDeployAndCreateRedPacketTx(redpacket);
    return await processTxAndSave(redpacket, txes, dryrun);
}

export async function buildCreateRedPacketRequest(input: RedPacketInput): Promise<UserOpRequest> {
    const walletAccount = useWalletStore().account!.address;
    const hexlAccount = useAccountStore().account!.address;
    const chain = useChainStore().chain;

    let userOps : Op[] = [];
    userOps.push(buildGasSponsorshipOp(hexlAccount, refunder(chain), input));
    userOps = userOps.concat(buildRedPacketOps(chain, input));
    const gas = {
        receiver: refunder(chain),
        token: input.gasToken,
        price: gasTokenPricePerGwei(
            chain,
            input.gasToken,
            useTokenStore().token(input.gasToken).decimals,
            input.priceInfo!
        )
    };
    const txData = encodeExecBatch(userOps.map(op => op.input));
    const {data, signature, nonce} = await encodeValidateAndCall({
        account: accountContract(useChainStore().provider, hexlAccount),
        txData,
        sign: async (msg: string) => await signMessage(walletAccount, msg),
        gas,
    });
    return {data, params: {txData, signature, nonce: nonce.toString(), gas}};
}

async function createRedPacketForHexlink(input: RedPacketInput, dryrun: boolean) {
    const chain = useChainStore().chain;
    const request = await buildCreateRedPacketRequest(input);
    try {
        await useChainStore().provider.estimateGas({
            to: useAccountStore().account!.address,
            data: request.data
        })
    } catch(err) {
        console.log("tx is likely to be reverted");
        console.log(err);
        throw err;
    }
    if (dryrun) {
        console.log(request);
        return {id: input.id!};
    } else {
        const opId = await callCreateRedPacket(
            chain, input, undefined, request
        );
        return {id: input.id!, opId};
    }
}

export async function createNewRedPacket(
    redpacket: RedPacketInput,
    useHexlinkAccount: boolean,
    dryrun: boolean = false
) : Promise<{id: string, opId?: number}> {
    if (useHexlinkAccount) {
        return await createRedPacketForHexlink(redpacket, dryrun);
    } else {
        const txes = await buildCreateRedPacketTxForMetamask(redpacket);
        return await processTxAndSave(redpacket, txes, dryrun);
    }
}

export async function callClaimRedPacket(redPacket: RedPacketDB) : Promise<void> {
    const claimRedPacket = httpsCallable(functions, 'claimRedPacket');
    const chain = getChain(redPacket.chain!);
    await claimRedPacket({
        chain: chain.name,
        redPacketId: redPacket.id,
        claimer: useAuthStore().userInfo,
    });
}

export async function callCreateRedPacket(
    chain: Chain,
    redPacket: RedPacketInput,
    txHash?: string,
    request?: UserOpRequest
) : Promise<number> {
    const createRedPacket = httpsCallable(functions, 'createRedPacket');
    const result = await createRedPacket({
        chain: chain.name,
        redPacket: redPacket,
        creator: useAuthStore().userInfo,
        txHash,
        request
    });
    return (result.data as any).id;
}

export async function queryRedPacketInfo(
    rp: RedPacketDB
) : Promise<RedPacketOnchainState> {
    const redPacket = await redPacketContract(
        useChainStore().provider,
    );
    const info = await redPacket.getPacket(rp.id);
    return {
        createdAt: new Date(info.createdAt.toNumber() * 1000),
        balance: info.balance.toString(),
        split: info.split
    } as RedPacketOnchainState;
}