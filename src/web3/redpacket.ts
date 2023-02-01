import type { RedPacketDB, RedPacketOnchainState } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useAuthStore } from "@/stores/auth";

import { genDeployAuthProof } from "@/web3/oracle";
import { tokenEqual } from "@/web3/utils";
import { estimateGas, sendTransaction, signMessage } from "@/web3/wallet";

import type { Token, Op, OpInput, Chain } from "../../functions/common";
import {
    hash,
    isNativeCoin,
    erc20Interface,
    erc20Contract,
    getChain,
    hexlAddress,
    hexlInterface,
    tokenAmount,
    accountContract,
    encodeValidateAndCall,
} from "../../functions/common";
import type { RedPacket } from "../../functions/redpacket";
import {
    redPacketContract,
    redpacketId,
    calcGasSponsorship,
    buildGasSponsorshipOp,
    buildRedPacketOps,
} from "../../functions/redpacket";

import { useChainStore } from "@/stores/chain";
import { useWalletStore } from "@/stores/wallet";
import { getPriceInfo } from "@/web3/network";
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

const refunder = "0x1A811678eEEDF16a1D0dF4b12e290F78a61A28F9";

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
    token: Token,
    owner: string,
    operator: string,
    requiredAmount: EthBigNumber,
) : Promise<Transaction[]> {
    const erc20 = erc20Contract(useChainStore().provider, token.address);
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
            to: token.address,
            from: owner,
            data,
            value: ethers.utils.hexValue(0),
        }
    }];
}

async function buildDepositErc20TokenOp(
    token: Token,
    from: string,
    to: string,
    amount: EthBigNumber
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
            input: buildOpInput({to: token.address, callData}),
        }]
    }
}

async function buildCreateRedPacketTxForMetamask(input: RedPacket) {
    const walletAccount = useWalletStore().account!.address;
    const hexlAccount = useAccountStore().account!.address;
    const chain = useChainStore().chain;

    const priceInfo = await getPriceInfo(chain);
    input.tokenAmount = tokenAmount(input.balance, input.token);
    input.gasTokenAmount = calcGasSponsorship(chain, input, priceInfo);

    let userOps : Op[] = [];
    let hexlOps: Op[] = [];
    let txes : any[] = [];
    let value : EthBigNumber = EthBigNumber.from(0);

    if (tokenEqual(input.token, input.gasToken)) {
        if (isNativeCoin(input.token, chain)) {
            value = value.add(input.tokenAmount!).add(input.gasTokenAmount)
        } else {
            const {tx, op} = await buildDepositErc20TokenOp(
                input.token,
                walletAccount,
                hexlAccount,
                input.tokenAmount!.add(input.gasTokenAmount)
            );
            txes = txes.concat(tx);
            userOps = userOps.concat(op);
        }
    } else {
        if (isNativeCoin(input.token, chain)) {
            value = value.add(input.tokenAmount!);
        } else {
            const {tx, op} = await buildDepositErc20TokenOp(
                input.token,
                walletAccount,
                hexlAccount,
                input.tokenAmount
            );
            txes = txes.concat(tx);
            userOps = userOps.concat(op);
        }
        if (isNativeCoin(input.gasToken, chain)) {
            value = value.add(input.gasTokenAmount);
        } else {
            const {tx, op} = await buildDepositErc20TokenOp(
                input.gasToken,
                walletAccount,
                hexlAccount,
                input.gasTokenAmount
            );
            txes = txes.concat(tx);
            userOps = userOps.concat(op);
        }
    }

    if (value.gt(0)) {
        hexlOps.push({
            name: "depositAll",
            function: "",
            args: {},
            input: buildOpInput({to: hexlAccount, value}),
        });
    }
    userOps.push(buildGasSponsorshipOp(
        chain, input, refunder, hexlAccount, priceInfo
    ));
    userOps = userOps.concat(buildRedPacketOps(chain, input));
    const {data: callData, signature, nonce} = await encodeValidateAndCall({
        account: accountContract(useChainStore().provider, hexlAccount),
        ops: userOps.map(op => op.input),
        sign: async (msg: string) => await signMessage(walletAccount, msg)
    });
    hexlOps.push({
        name: "createRedPacket",
        function: "validateAndCall",
        args: {
            txData: userOps,
            nonce,
            signature,
        },
        input: buildOpInput({to: hexlAccount, callData}),
    });
    const hexlAddr = hexlAddress(useChainStore().chain);
    const data = hexlInterface.encodeFunctionData(
        "process", [hexlOps.map(hexlOp => hexlOp.input)]
    );
    const totalValue = hexlOps.reduce(
        (sum, hexlOp) => sum.add(hexlOp.input.value),
        EthBigNumber.from(0)
    );
    txes.push({
        name: "createRedPacket",
        function: "process",
        args: {ops: hexlOps},
        input: {
            to: hexlAddr,
            from: useWalletStore().account!.address,
            value: ethers.utils.hexValue(totalValue),
            data,
        }
    });
    return txes;
}

export async function buildDeployAndCreateRedPacketTx(input: RedPacket) : Promise<any> {
    const txes = await buildCreateRedPacketTxForMetamask(input);

    // pop execBatch op and encode it to init
    const tx = txes.pop(); 
    const ops: Op[] = tx.args.ops;
    const op = ops.pop();

    const { initData, proof } = await genDeployAuthProof(op!.input.callData);
    const name = useAuthStore().user!.nameHash;
    const authProof = {
        authType: hash(proof.authType),
        identityType: hash(proof.identityType),
        issuedAt: EthBigNumber.from(proof.issuedAt),
        signature: proof.signature
    };
    const callData = hexlInterface.encodeFunctionData(
        "deploy", [name, initData, authProof]
    );
    const hexlAddr = hexlAddress(useChainStore().chain);
    ops.push({
        name: "deployAndCreateRedPacket",
        function: "deploy",
        args: {
            name: useAuthStore().user!.nameHash,
            initData: op,
            authProof
        },
        input: buildOpInput({to: hexlAddr, callData}),
    });
    const data = hexlInterface.encodeFunctionData(
        "process", [ops.map(op => op.input)]
    );
    const value = ops.reduce((sum, op) => sum.add(op.input.value), EthBigNumber.from(0));
    txes.push({
        name: "deployAndCreateRedPacket",
        function: "process",
        args: ops,
        input: {
            to: hexlAddr,
            from: useWalletStore().account!.address,
            value: ethers.utils.hexValue(value),
            data,
        }
    });
    return txes;
}

async function processTxAndSave(
    redpacket: RedPacket,
    txes: any[],
    dryrun: boolean
) : Promise<{id: string, opId?: number}> {
    const chain = useChainStore().chain;
    const id = redpacketId(chain, useAccountStore().account!.address, redpacket);
    if (dryrun) {
        for (let i = 0; i < txes.length; i++) {
            const gasUsed = await estimateGas(txes[i].tx);
            console.log({
                tx: txes[i],
                gasUsed: EthBigNumber.from(gasUsed).toString()
            })
        }
        return {id};
    }
    
    for (let i = 0; i < txes.length; i++) {
        const txHash = await sendTransaction(txes[i].input);
        if (txes[i].name == "createRedPacket" ||
            txes[i].name == "deployAndCreateRedPacket") {
            const opId = await callCreateRedPacket(chain, redpacket, txHash);
            return {id, opId};
        }
    }
    return {id};
}

export async function deployAndCreateNewRedPacket(
    redpacket: RedPacket,
    useHexlinkAccount: boolean,
    dryrun: boolean = false
) {
    if (useHexlinkAccount) {
        throw new Error("Not supported");
    }
    const txes = await buildDeployAndCreateRedPacketTx(redpacket);
    return await processTxAndSave(redpacket, txes, dryrun);
}

export async function createNewRedPacket(
    redpacket: RedPacket,
    useHexlinkAccount: boolean,
    dryrun: boolean = false
) : Promise<{id: string, opId?: number}> {
    if (useHexlinkAccount) {
        throw new Error("not supported yet")
    }
    const txes = await buildCreateRedPacketTxForMetamask(redpacket);
    return await processTxAndSave(redpacket, txes, dryrun);
}

export async function callClaimRedPacket(redPacket: RedPacketDB) : Promise<void> {
    const claimRedPacket = httpsCallable(functions, 'claimRedPacket');
    const chain = getChain(redPacket.chain);
    await claimRedPacket({
        chain: chain.name,
        redPacketId: redPacket.id,
        claimer: useAuthStore().userInfo,
        serverUpdate: true,
    });
}

export async function callCreateRedPacket(
    chain: Chain,
    redPacket: RedPacket,
    txHash: string
) : Promise<number> {
    const createRedPacket = httpsCallable(functions, 'createRedPacket');
    const result = await createRedPacket({
        chain: chain.name,
        redPacket: redPacket,
        creator: useAuthStore().userInfo,
        txHash
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