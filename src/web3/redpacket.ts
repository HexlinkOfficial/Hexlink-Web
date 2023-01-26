import type { RedPacketDB } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useAuthStore } from "@/stores/auth";

import { genDeployAuthProof } from "@/web3/oracle";
import { tokenEqual } from "@/web3/utils";
import { estimateGas, sendTransaction } from "@/web3/wallet";

import type { Chain, Token, UserOp, Transaction } from "../../functions/common";
import {
    hash,
    isNativeCoin,
    erc20Interface,
    erc20Contract,
    getChain,
    hexlAddress,
    hexlInterface,
    tokenAmount,
} from "../../functions/common";
import type { RedPacket } from "../../functions/redpacket";
import {
    redPacketAddress,
    redPacketContract,
    redPacketMode,
    calcGasSponsorship,
    buildCreateRedPacketTx
} from "../../functions/redpacket";

import { useChainStore } from "@/stores/chain";
import { useWalletStore } from "@/stores/wallet";
import { insertRedPacket } from "@/graphql/redpacket";
import { getPriceInfo } from "@/web3/network";
import { updateRedPacketClaimer } from "@/graphql/redpacketClaim";
import { useAccountStore } from "@/stores/account";

import { getFunctions, httpsCallable } from 'firebase/functions'
const functions = getFunctions();

export function validator() : string {
    if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR) {
        return "0xEF2e3F91209F88A3143e36Be10D52502162426B3";
    }
    return "0x030ffbc193c3f9f4c6378beb506eecb0933fd457";
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
    const args = [
        operator,
        ethers.constants.MaxInt256
    ];
    const data = erc20Interface.encodeFunctionData(
        "approve", args
    );
    return [{
        name: "approveHexlAccount",
        function: "approve",
        args,
        input: {
            to: token.address,
            from: owner,
            data,
            value: ethers.utils.hexValue(0),
        }
    }];
}

function buildDepositErc20TokenOp(
    token: Token,
    from: string,
    to: string,
    amount: EthBigNumber
) {
    const args = [from, to, amount]
    return {
        name: "depositErc20",
        function: "transferFrom",
        args,
        input: {
            to: token.address,
            value: EthBigNumber.from(0),
            callData: erc20Interface.encodeFunctionData(
                "transferFrom", args
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        }
    };
}

async function buildCreateRedPacketTxForMetamask(input: RedPacket) {
    const walletAccount = useWalletStore().account!;
    const hexlAccount = useAccountStore().account!;
    const chain = useChainStore().chain;
    let ops : UserOp[] = [];
    let txes : any[] = [];
    let value : EthBigNumber = EthBigNumber.from(0);
    const priceInfo = await getPriceInfo(chain);
    input.tokenAmount = tokenAmount(input.balance, input.token);
    input.gasTokenAmount = calcGasSponsorship(chain, input, priceInfo);

    if (isNativeCoin(input.token, chain) && isNativeCoin(input.gasToken, chain)) {
        value = value.add(input.tokenAmount).add(input.gasTokenAmount)
    } else if (isNativeCoin(input.token, chain)) {
        value = value.add(input.tokenAmount);
        txes.concat(await buildApproveTx(
            input.gasToken,
            walletAccount.address,
            hexlAccount.address,
            input.gasTokenAmount
        ));
        ops.push(buildDepositErc20TokenOp(
            input.gasToken,
            walletAccount.address,
            hexlAccount.address,
            input.gasTokenAmount
        ));
    } else if (isNativeCoin(input.gasToken, chain)) {
        value = value.add(input.gasTokenAmount);
        txes.concat(await buildApproveTx(
            input.token,
            walletAccount.address,
            hexlAccount.address,
            input.tokenAmount
        ));
        ops.push(buildDepositErc20TokenOp(
            input.token,
            walletAccount.address,
            hexlAccount.address,
            input.tokenAmount
        ));
    } else if (tokenEqual(input.token, input.gasToken)) {
        txes.concat(await buildApproveTx(
            input.token,
            walletAccount.address,
            hexlAccount.address,
            input.tokenAmount.add(input.gasTokenAmount)
        ));
        ops.push(buildDepositErc20TokenOp(
            input.token,
            walletAccount.address,
            hexlAccount.address,
            input.tokenAmount.add(input.gasTokenAmount),
        ));
    } else {
        txes.concat(await buildApproveTx(
            input.token,
            walletAccount.address,
            hexlAccount.address,
            input.tokenAmount
        ));
        ops.push(buildDepositErc20TokenOp(
            input.token,
            walletAccount.address,
            hexlAccount.address,
            input.tokenAmount,
        ));
        txes.concat(await buildApproveTx(
            input.gasToken,
            walletAccount.address,
            hexlAccount.address,
            input.gasTokenAmount
        ));
        ops.push(buildDepositErc20TokenOp(
            input.gasToken,
            walletAccount.address,
            hexlAccount.address,
            input.gasTokenAmount,
        ));
    }
    txes.push(buildCreateRedPacketTx(
        chain,
        useChainStore().refunder,
        hexlAccount.address,
        ops,
        input,
        walletAccount.address,
        priceInfo
    ));
    return txes;
}

export async function buildDeployAndCreateRedPacketTx(input: RedPacket) : Promise<any> {
    const txes = await buildCreateRedPacketTxForMetamask(input);
    const tx = txes.pop(); // last tx is the redpacket creation tx
    const { initData, proof } = await genDeployAuthProof(tx.tx.data);
    const args = [useAuthStore().user!.nameHash, initData, {
        authType: hash(proof.authType),
        identityType: hash(proof.identityType),
        issuedAt: EthBigNumber.from(proof.issuedAt),
        signature: proof.signature
    }];
    const data = hexlInterface.encodeFunctionData(
        "deploy", args
    );
    txes.push({
        name: "deployAndCreateRedPacket",
        function: "deploy",
        args,
        input: {
            to: hexlAddress(useChainStore().chain),
            from: useWalletStore().account!.address,
            value: tx.tx.value,
            data,
        }
    });
    return txes;
}

function redpacketId(chain: Chain, input: RedPacket) {
    const redPacketType = "tuple(address,bytes32,uint256,address,uint32,uint8)";
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["uint256", "address", "address", redPacketType],
            [
                Number(chain.chainId),
                redPacketAddress(chain),
                useAccountStore().account!.address,
                [
                    input.token.address,
                    input.salt,
                    tokenAmount(input.balance, input.token),
                    input.validator,
                    input.split,
                    redPacketMode(input.mode)
                ]
            ]
        )
    );
}

async function processTxAndSave(
    redpacket: RedPacket,
    txes: any[],
    dryrun: boolean
) : Promise<string> {
    const chain = useChainStore().chain;
    const id = redpacketId(chain, redpacket);
    if (dryrun) {
        for (let i = 0; i < txes.length; i++) {
            const gasUsed = await estimateGas(txes[i].tx);
            console.log({
                tx: txes[i],
                gasUsed: EthBigNumber.from(gasUsed).toString()
            })
        }
        return id;
    }

    const toInsert = {
        id,
        chain: chain.name,
        metadata: {
            token: redpacket.token.address,
            salt: redpacket.salt,
            split: redpacket.split,
            balance: redpacket.balance,
            tokenAmount: redpacket.tokenAmount!.toString(),
            mode: redpacket.mode,
            validator: redpacket.validator,
            gasToken: redpacket.gasToken.address,
            gasTokenAmount: redpacket.gasTokenAmount!.toString(),
            contract: redPacketAddress(chain),
            creator: useAccountStore().account!.address
        },
        creator: useAuthStore().userInfo
    };
    for (let i = 0; i < txes.length; i++) {
        let txHash = await sendTransaction(txes[i].input);
        if (txes[i].name == "createRedPacket" || txes[i].name == "deployAndCreateRedPacket") {
            await insertRedPacket([{
                ...toInsert,
                tx: txHash
            }]);
        }
    }
    return id;
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
) : Promise<string> {
    if (useHexlinkAccount) {
        throw new Error("not supported yet")
    }
    const txes = await buildCreateRedPacketTxForMetamask(redpacket);
    return await processTxAndSave(redpacket, txes, dryrun);
}

export async function claimRedPacket(redPacket: RedPacketDB) : Promise<void> {
    const claimRedPacket = httpsCallable(functions, 'claimRedPacket');
    const chain = getChain(redPacket.chain);
    const result = await claimRedPacket({chainId: chain.chainId, redPacketId: redPacket.id});
    const {id} = result.data as {id: number, tx: string};
    await updateRedPacketClaimer(id, useAuthStore().userInfo);
}

export async function queryRedPacketInfo(rp: RedPacketDB) : Promise<{
    balance: EthBigNumber,
    split: number,
    createdAt: Date
}> {
    const redPacket = await redPacketContract(
        useChainStore().provider,
        // rp.metadata.contract
    );
    const info = await redPacket.getPacket(rp.id);
    return {
        createdAt: new Date(info.createdAt.toNumber() * 1000),
        balance: info.balance,
        split: info.split
    }
}