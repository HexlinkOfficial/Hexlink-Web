import type { RedPacketDB, RedPacketOnchainState } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useAuthStore } from "@/stores/auth";

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

async function simulate(to: string, data: string, value: string) {
    try {
        await useChainStore().provider.estimateGas(
            {to, data, value}
        );
    } catch(err) {
        console.log("tx is likely to be reverted");
        console.log(err);
        throw err;
    }
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

async function buildCreateRedPacketTxForMetamask(
    input: RedPacketInput,
    deploy?: boolean
) {
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
    if (!deploy) {
        txes.push({
            name: "createRedPacket",
            function: "execBatch",
            args: {ops: userOps},
            input: {
                to: useAccountStore().account!.address,
                from: useWalletStore().account!.address,
                value: ethers.utils.hexValue(value),
                data: encodeExecBatch(userOps.map(op => op.input)),
            }
        });
    } else {
        txes.push(await buildDeployTxForMetaMask(userOps, value));
    }
    return txes;
}

export async function buildDeployTxForMetaMask(
    userOps: Op[],
    value: EthBigNumber
) : Promise<any> {
    const hexlAccount = useAccountStore().account!.address;
    const walletAccount = useWalletStore().account!.address;

    const execData = encodeExecBatch(userOps.map(op => op.input));
    const { initData, proof } = await genDeployAuthProof(execData);
    const name = useAuthStore().user!.nameHash;
    const authProof = {
        authType: hash(proof.authType),
        identityType: hash(proof.identityType),
        issuedAt: EthBigNumber.from(proof.issuedAt),
        signature: proof.signature
    };
    const deployData = hexlInterface.encodeFunctionData(
        "deploy", [name, initData, authProof]
    );
    const hexlAddr = hexlAddress(useChainStore().chain);
    const data = hexlInterface.encodeFunctionData("process", [[
        // deposit
        {
            to: hexlAccount,
            value,
            callData: [],
            callGasLimit: "0"
        },
        // deploy and create redpacket
        {
            to: hexlAddr,
            value: "0",
            callData: deployData,
            callGasLimit: "0"
        },
    ]]);
    return {
        name: "createRedPacket",
        function: "process",
        args: {
            "deposit": {
                to: hexlAccount,
                value: value.toString(),
            },
            "deploy": {
                name,
                initData: {
                    owner: walletAccount,
                    data: userOps,
                },
                authProof,
            }
        },
        input: {
            to: hexlAddr,
            from: walletAccount,
            value: ethers.utils.hexValue(value),
            data,
        }
    };
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
    const txes = await buildCreateRedPacketTxForMetamask(redpacket, true);
    return await processTxAndSave(redpacket, txes, dryrun);
}

export async function buildCreateRedPacketRequest(
    input: RedPacketInput
): Promise<UserOpRequest> {
    const walletAccount = useWalletStore().account!.address;
    const hexlAccount = useAccountStore().account!.address;
    const chain = useChainStore().chain;

    let userOps : Op[] = [];
    userOps.push(buildGasSponsorshipOp(hexlAccount, refunder(chain), input));
    userOps = userOps.concat(buildRedPacketOps(chain, input));
    const gas = {
        receiver: refunder(chain),
        token: input.gasToken,
        baseGas: "0",
        price: gasTokenPricePerGwei(
            chain,
            input.gasToken,
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
    await simulate(useAccountStore().account!.address, data, "0");
    return {txData, signature, nonce: nonce.toString(), gas};
}

export async function createNewRedPacket(
    redpacket: RedPacketInput,
    useHexlinkAccount: boolean,
    dryrun: boolean = false
) : Promise<{id: string, opId?: number}> {
    if (useHexlinkAccount) {
        const chain = useChainStore().chain;
        const request = await buildCreateRedPacketRequest(redpacket);
        if (dryrun) {
            console.log(request);
            return {id: redpacket.id!};
        }
        const opId = await callCreateRedPacket(
            chain, redpacket, undefined, request
        );
        return {id: redpacket.id!, opId};
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
        version: useAccountStore().version,
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
        request,
        version: useAccountStore().version,
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