import type { RedPacketDB, RedPacketOnchainState } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useAuthStore } from "@/stores/auth";

import { genDeployAuthProof } from "@/web3/oracle";
import { tokenEqual } from "@/web3/utils";
import { estimateGas, sendTransaction } from "@/web3/wallet";

import type { Op, Chain, UserOpRequest, DeployRequest} from "../../../functions/common";
import type { RedPacket } from "../../../functions/redpacket";
import {
    hash,
    hexlContract,
    isNativeCoin,
    erc20Interface,
    erc20Contract,
    getChain,
    hexlAddress,
    hexlInterface,
    encodeExecBatch,
    refunder,
    isContract,
} from "../../../functions/common";
import type { RedPacketInput, RedPacketErc721Input } from "../../../functions/redpacket";
import {
    redPacketContract,
    buildRedPacketOps,
    buildDeployErc721Ops,
    tokenFactoryAddress,
    hexlinkErc721Contract,
} from "../../../functions/redpacket";

import { useChainStore } from "@/stores/chain";
import { useWalletStore } from "@/stores/wallet";
import { useAccountStore } from "@/stores/account";
import { buildOpInput, buildUserOpRequest } from "@/web3/operation";

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
    return import.meta.env.VITE_AIRDROP_VALIDATOR;
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

async function buildTransactionsForMetamask(
    hexlAccount: string,
    walletAccount: string,
    userOps: Op[],
    txes: Transaction[],
    value: string | number | EthBigNumber,
) : Promise<Transaction[]> {
    const execData = encodeExecBatch(userOps.map(op => op.input));
    const deployed = await isContract(useChainStore().provider, hexlAccount);
    if (deployed) {
        txes.push({
            name: "createRedPacket",
            function: "execBatch",
            args: {ops: userOps},
            input: {
                to: useAccountStore().account!.address,
                from: useWalletStore().account!.address,
                value: ethers.utils.hexValue(value),
                data: execData,
            }
        });
        return txes;
    }

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
        {to: hexlAccount, value, callData: [], callGasLimit: "0"},
        // deploy and create redpacket
        {to: hexlAddr, value: "0", callData: deployData, callGasLimit: "0"},
    ]]);
    txes.push({
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
    });
    return txes;
}

async function createRedPacketTxForMetamask(
    input: RedPacketInput
) : Promise<Transaction[]> {
    const walletAccount = useWalletStore().account!.address;
    const hexlAccount = useAccountStore().account!.address;
    const chain = useChainStore().chain;

    let userOps : Op[] = [];
    let txes : any[] = [];
    let value : EthBigNumber = EthBigNumber.from(0);
    if (tokenEqual(input.token, input.gasToken)) {
        const toTransfer = EthBigNumber.from(
            input.gasSponsorship).add(input.balance);
        if (isNativeCoin(input.token, chain)) {
            value = value.add(toTransfer);
        } else {
            const {tx, op} = await buildDepositErc20TokenOp(
                input.token,
                walletAccount,
                hexlAccount,
                toTransfer,
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
            value = value.add(input.gasSponsorship);
        } else {
            const {tx, op} = await buildDepositErc20TokenOp(
                input.gasToken,
                walletAccount,
                hexlAccount,
                input.gasSponsorship
            );
            txes = txes.concat(tx);
            userOps = userOps.concat(op);
        }
    }
 
    userOps = userOps.concat(await buildRedPacketOps(
        useChainStore().provider,
        input
    ));
    return await buildTransactionsForMetamask(
        hexlAccount,
        walletAccount,
        userOps,
        txes,
        value,
    );
}

async function processTxAndSave(
    redpacket: RedPacketInput | RedPacketErc721Input,
    txes: any[],
    postProcess: any,
    dryrun: boolean
) : Promise<{id: string, opId?: number}> {
    const chain = useChainStore().chain;
    if (dryrun) {
        for (let i = 0; i < txes.length; i++) {
            const gasUsed = await estimateGas(chain, txes[i].tx);
            console.log({
                tx: txes[i],
                gasUsed: EthBigNumber.from(gasUsed).toString()
            })
        }
        return {id: redpacket.id!};
    }

    for (let i = 0; i < txes.length; i++) {
        const txHash = await sendTransaction(chain, txes[i].input);
        if (txes[i].name == "createRedPacket") {
            const opId = await postProcess(chain, redpacket as RedPacketInput, txHash);
            return {id: redpacket.id!, opId};
        }
    }
    return {id: redpacket.id!};
}

async function buildCreateRedPacketRequest(
    input: RedPacketInput
): Promise<{
    params: UserOpRequest,
    deploy?: DeployRequest,
}> {
    const hexlAccount = useAccountStore().account!.address;
    let userOps : Op[] = await buildRedPacketOps(
        useChainStore().provider,
        input
    );
    return await buildUserOpRequest(
        userOps.map(op => op.input),
        input.gasToken
    );
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
        const txes = await createRedPacketTxForMetamask(redpacket);
        return await processTxAndSave(redpacket, txes, callCreateRedPacket, dryrun);
    }
}

export async function callClaimRedPacket(
    redPacket: RedPacketDB,
    secret: string | undefined,
) : Promise<{id: number}> {
    const claimRedPacket = httpsCallable(functions, 'claimRedPacket');
    const chain = getChain(redPacket.chain!);
    const result = await claimRedPacket({
        chain: chain.name,
        redPacketId: redPacket.id,
        claimer: useAuthStore().userInfo,
        accountVersion: useAccountStore().version,
        secret
    });
    if ((result.data as any)?.code == 422) {
        throw new Error(result.data.message);
    }
    return {id: result.data.id};
}

export async function callCreateRedPacket(
    chain: Chain,
    redPacket: RedPacketInput,
    txHash?: string,
    request?: {
        params: UserOpRequest,
        deploy?: DeployRequest
    }
) : Promise<number> {
    const createRedPacket = httpsCallable(functions, 'createRedPacket');
    const result = await createRedPacket({
        chain: chain.name,
        redPacket: redPacket,
        creator: useAuthStore().userInfo,
        txHash,
        request,
        accountVersion: useAccountStore().version,
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
        balanceLeft: info.balance.toString(),
        claimsLeft: info.split,
        sponsorship: info.gasSponsorship.toString(),
    } as RedPacketOnchainState;
}

export async function queryErc721RedPacketInfo(
    address: string
) : Promise<RedPacketOnchainState> {
    const redPacketErc721 = await hexlinkErc721Contract(
        address, useChainStore().provider
    );
    const supply = await redPacketErc721.maxSupply();
    const tokenId = await redPacketErc721.tokenId();
    const sponsorship = await redPacketErc721.gasSponsorship();
    return {
        balanceLeft: supply.sub(tokenId).toString(),
        claimsLeft: supply.sub(tokenId).toString(),
        sponsorship: sponsorship.toString(),
    } as RedPacketOnchainState;
}

export async function createRedPacketErc721ForMetamask(
    input: RedPacketErc721Input,
) : Promise<Transaction[]> {
    const walletAccount = useWalletStore().account!.address;
    const hexlAccount = useAccountStore().account!.address;
    const chain = useChainStore().chain;

    let userOps : Op[] = [];
    let txes : any[] = [];
    let value : EthBigNumber = EthBigNumber.from(0);

    if (isNativeCoin(input.gasToken, chain)) {
        value = value.add(input.gasSponsorship);
    } else {
        const {tx, op} = await buildDepositErc20TokenOp(
            input.gasToken,
            walletAccount,
            hexlAccount,
            input.gasSponsorship
        );
        txes = txes.concat(tx);
        userOps = userOps.concat(op);
    }
    userOps = userOps.concat(await buildDeployErc721Ops(
        useChainStore().provider, input
    ));
    return await buildTransactionsForMetamask(
        hexlAccount,
        walletAccount,
        userOps,
        txes,
        value,
    );
}

async function buildCreateRedPacketErc721Request(
    input: RedPacketErc721Input
): Promise<{
    params: UserOpRequest,
    deploy?: DeployRequest,
}> {
    const hexlAccount = useAccountStore().account!.address;
    const chain = useChainStore().chain;
    const userOps = await buildDeployErc721Ops(
        useChainStore().provider, input
    );
    return await buildUserOpRequest(
        userOps.map(op => op.input),
        input.gasToken
    );
}

export async function callCreateRedPacketErc721(
    chain: Chain,
    input: RedPacketErc721Input,
    txHash?: string,
    request?: {
        params: UserOpRequest,
        deploy?: DeployRequest
    }
) : Promise<number> {
    const createRedPacketErc721 = httpsCallable(functions, 'createRedPacketErc721');
    const result = await createRedPacketErc721({
        chain: chain.name,
        erc721: input,
        creator: useAuthStore().userInfo,
        txHash,
        request,
        accountVersion: useAccountStore().version,
    });
    return (result.data as any).id;
}

export async function createRedPacketErc721(
    input: RedPacketErc721Input,
    useHexlinkAccount: boolean,
    dryrun: boolean = false,
) : Promise<{id: string, opId?: number}> {
    if (useHexlinkAccount) {
        const chain = useChainStore().chain;
        const request = await buildCreateRedPacketErc721Request(input);
        if (dryrun) {
            console.log(request);
            return {id: input.id!};
        }
        const opId = await callCreateRedPacketErc721(
            chain, input, undefined, request
        );
        return {id: input.id!, opId};
    } else {
        const txes = await createRedPacketErc721ForMetamask(input);
        return await processTxAndSave(input, txes, callCreateRedPacketErc721, dryrun);
    }
}

export async function claimCountdown(chain: Chain, redPacketId: string, code: string) {
    const callClaimCountdown = httpsCallable(functions, 'claimCountdown');
    const result = await callClaimCountdown({
        chain: chain.name, redPacketId, code
    });
    return (result.data as any).countdown;
}

async function buildRefundErc20Op(
    chain: Chain,
    redPacket: RedPacket
) : Promise<OpInput> {
  const metadata = redPacket.metadata as RedPacketMetadata;
  const packet = {
    creator: metadata.creator,
    token: metadata.token,
    salt: metadata.salt,
    balance: metadata.balance,
    validator: metadata.validator,
    split: metadata.split,
    mode: metadata.mode,
    sponsorGas: true,
  };

  return {
    to: redPacketAddress(chain),
    value: "0x00",
    callData: redPacketInterface.encodeFunctionData(
        "refund", [packet]
    ),
    callGasLimit: "0x00",
  };
}

async function buildWithdrawErc721Op(
    redPacket: RedPacket
) : Promise<OpInput> {
  return {
    to: redPacket.metadata.token,
    value: "0x00",
    callData: hexlinkErc721Interface.encodeFunctionData(
        "withdraw", []
    ),
    callGasLimit: "0x00",
  };
}

async function buildRefundRedPacketRequest(
    chain: Chain,
    redPacket: RedPacketDB
): Promise<{
    params: UserOpRequest,
    deploy?: DeployRequest,
}> {
    const hexlAccount = useAccountStore().account!.address;
    const userOps = redPacket.type === "erc20"
        ? [await buildRefundErc20Op(chain, redPacket)]
        : [await buildWithdrawErc721Op(redPacket)];
    return await buildUserOpRequest(
        userOps.map(op => op.input),
        input.gasToken
    );
}

export async function refundRedPacket(chain: Chain, redPacket: RedPacketDB) {
    const request = buildRefundRedPacketRequest(chain, redPacket)
    const refundRedPacketFunction = httpsCallable(functions, 'refundRedPacket');
    const result = await refundRedPacketFunction({
        chain: chain.name,
        redPacketId: redPacket.id,
        request
    });
    return (result.data as any).id;
}

export async function getCreatedRedPacketsList() {
    const hexlink = await hexlContract(useChainStore().provider);
    const address = await hexlink.addressOfName(useAuthStore().user.nameHash);
    const redPacket = await redPacketContract(useChainStore().provider);
    const filter = redPacket.filters.Created(null, address, null);

    let events = []
    const history = await redPacket.queryFilter(filter);
    events.push(...history);

    let createdRedPackets: RedPacket[] = [];
    events.forEach((event) => {
        const args = event.args[2];
        const redpacket: RedPacket = {
            id: event.args[0],
            salt: args[2],
            validator: args[4],
            creator: event.args[1],
            sponsorGas: args[7],
            token: args[1],
            mode: args[6],
            split: args[5],
            balance: args[3],
            type: "erc20",
            validationRules: [],
            contract: event.address
        }
        createdRedPackets.push(redpacket);
    });
    console.log("created");
    console.log(createdRedPackets);

    return createdRedPackets;
}

export async function getClaimedRedPacketsList() {
    const hexlink = await hexlContract(useChainStore().provider);
    const address = await hexlink.addressOfName(useAuthStore().user.nameHash);
    const redPacket = await redPacketContract(useChainStore().provider);
    const filter = redPacket.filters.Claimed(null, address, null);

    let events = []
    const history = await redPacket.queryFilter(filter);
    events.push(...history);

    let claimedRedPackets = [];
    events.forEach((event) => {
        const args = event.args[2];
        const redpacket = {
            id: event.args[0],
            claimer: event.args[1],
            amount: event.args[2],
            type: "erc20"
        }
        claimedRedPackets.push(redpacket);
    });

    console.log("claimed");
    console.log(claimedRedPackets);
    return claimedRedPackets;
}
