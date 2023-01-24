import type { Transaction, UserOp, RedPacketDB } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useAuthStore } from "@/stores/auth";

import { genDeployAuthProof } from "@/web3/oracle";
import { toEthBigNumber, tokenBase, tokenEqual } from "@/web3/utils";
import { estimateGas, sendTransaction } from "@/web3/wallet";

import type { Account, Chain, Token } from "../../functions/common";
import {
    hash,
    isNativeCoin,
    isWrappedCoin,
    isStableCoin,
    erc20Interface,
    erc20Contract,
    getChain,
    hexlAddress,
    hexlInterface,
    accountInterface,
} from "../../functions/common";
import type { RedPacket } from "../../functions/redpacket";
import {
    redPacketInterface,
    redPacketAddress,
    redPacketContract
} from "../../functions/redpacket";

import { useChainStore } from "@/stores/chain";
import { useWalletStore } from "@/stores/wallet";
import { insertRedPacket } from "@/graphql/redpacket";
import { BigNumber } from "bignumber.js";
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

function redPacketMode(mode: string) : number {
    return mode == "random" ? 2 : 1;
}

export async function estimateGasSponsorship(
    redpacket: RedPacket
) : Promise<EthBigNumber> {
    const sponsorshipGasAmount = EthBigNumber.from(200000).mul(redpacket.split);
    const gasToken = redpacket.gasToken;
    const chain = useChainStore().chain;
    const priceInfo = await getPriceInfo(chain);
    if (isNativeCoin(gasToken, chain) || isWrappedCoin(gasToken, chain)) {
        return sponsorshipGasAmount.mul(priceInfo.gasPrice);
    } else if (isStableCoin(gasToken, chain)) {
        // calculate usd value of tokens
        const normalizedUsd = tokenBase(gasToken).times(priceInfo.nativeCurrencyInUsd);
        const nativeCoinBase = EthBigNumber.from(10).pow(chain.nativeCurrency.decimals);
        return toEthBigNumber(normalizedUsd).mul(sponsorshipGasAmount).mul(
            priceInfo.gasPrice
        ).div(nativeCoinBase);
    }
    throw new Error("Unsupported gas token");
}

export function calcTokenAmount(
    balance: string | number,
    token: Token
) : EthBigNumber {
    const base = new BigNumber(10).pow(token.decimals);
    return toEthBigNumber(base.times(balance));
}

export function redPacketOps(
    input: RedPacket
) : UserOp[] {
    const chain = useChainStore().chain;
    const packet = {
       token: input.token.address,
       salt: input.salt,
       balance: calcTokenAmount(input.balance, input.token),
       validator: input.validator,
       split: input.split,
       mode: redPacketMode(input.mode),
    };
    const redPacketAddr = redPacketAddress(chain);
    if (isNativeCoin(input.token, chain)) {
        return [{
            name: "createRedPacket",
            function: "create",
            args: [packet],
            op: {
                to: redPacketAddr,
                value: packet.balance,
                callData: redPacketInterface.encodeFunctionData(
                    "create", [packet]
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        }];
    } else {
        return [{
            name: "approveRedPacket",
            function: "approve",
            args: [redPacketAddr, packet.balance],
            op: {
                to: input.token.address,
                value: EthBigNumber.from(0),
                callData: erc20Interface.encodeFunctionData(
                    "approve", [redPacketAddr, packet.balance]
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        },
        {
            name: "createRedPacket",
            function: "create",
            args: [packet],
            op: {
                to: redPacketAddr,
                value: EthBigNumber.from(0),
                callData: redPacketInterface.encodeFunctionData(
                    "create", [packet]
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        }];
    }
}

async function validAllowance(
    token: Token,
    owner: Account,
    operator: Account,
    requiredAmount: EthBigNumber
) {
    const erc20 = erc20Contract(useChainStore().provider, token.address);
    const allowance = await erc20.allowance(
        owner.address,
        operator.address
    );
    return allowance.gte(requiredAmount);
}

async function buildApproveTx(
    contract: string,
    owner: string,
    operator: string,
) : Promise<Transaction> {
    const args = [
        operator,
        ethers.constants.MaxInt256
    ];
    const data = erc20Interface.encodeFunctionData(
        "approve", args
    );
    return {
        name: "approveHexlAccount",
        function: "approve",
        args,
        tx: {
            to: contract,
            from: owner,
            data,
        }
    };
}

async function buildCreateRedPacketTx(
    input: RedPacket,
    useHexlinkAccount: boolean
) {
    const walletAccount = useWalletStore().account!;
    const hexlAccount = useAccountStore().account!;
    let ops : UserOp[] = [];
    let txes : any[] = [];
    let value : EthBigNumber = EthBigNumber.from(0);
    input.tokenAmount = calcTokenAmount(input.balance, input.token);
    const chain = useChainStore().chain;
    input.gasTokenAmount = await estimateGasSponsorship(input);
    if (!useHexlinkAccount) {
         if (isNativeCoin(input.token, chain) && isNativeCoin(input.gasToken, chain)) {
            value = value.add(input.tokenAmount).add(input.gasTokenAmount)
        } else if (isNativeCoin(input.token, chain)) {
            value = value.add(input.tokenAmount);
            const valid = await validAllowance(
                input.gasToken,
                walletAccount,
                hexlAccount,
                input.gasTokenAmount);
            if (!valid) {
                txes.push(await buildApproveTx(
                    input.gasToken.address,
                    walletAccount.address,
                    hexlAccount.address
                ));
            }
            const args = [
                walletAccount.address,
                hexlAccount.address,
                input.gasTokenAmount
            ];
            ops.push({
                name: "depositGasToken",
                function: "transferFrom",
                args,
                op: {
                    to: input.gasToken.address,
                    value: EthBigNumber.from(0),
                    callData: erc20Interface.encodeFunctionData(
                        "transferFrom", args
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
        } else if (isNativeCoin(input.gasToken, chain)) {
            value = value.add(input.gasTokenAmount);
            const valid = await validAllowance(
                input.token,
                walletAccount,
                hexlAccount,
                input.tokenAmount);
            if (!valid) {
                txes.push(await buildApproveTx(
                    input.token.address,
                    walletAccount.address,
                    hexlAccount.address
                ));
            }
            const args = [
                walletAccount.address,
                hexlAccount.address,
                input.tokenAmount
            ];
            ops.push({
                name: "depositToken",
                function: "transferFrom",
                args,
                op: {
                    to: input.token.address,
                    value: EthBigNumber.from(0),
                    callData: erc20Interface.encodeFunctionData(
                        "transferFrom", args
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
        } else if (tokenEqual(input.token, input.gasToken)) {
            const valid = await validAllowance(
                input.token,
                walletAccount,
                hexlAccount,
                input.tokenAmount.add(input.gasTokenAmount));
            if (!valid) {
                txes.push(await buildApproveTx(
                    input.token.address,
                    walletAccount.address,
                    hexlAccount.address
                ));
            }
            const args = [
                walletAccount.address,
                hexlAccount.address,
                input.tokenAmount.add(input.gasTokenAmount)
            ];
            ops.push({
                name: "depositTokenAndGasToken",
                function: "transferFrom",
                args,
                op: {
                    to: input.token.address,
                    value: EthBigNumber.from(0),
                    callData: erc20Interface.encodeFunctionData(
                        "transferFrom", args
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
        } else {
            const valid1 = await validAllowance(
                input.token,
                walletAccount,
                hexlAccount,
                input.tokenAmount);
            if (!valid1) {
                txes.push(await buildApproveTx(
                    input.token.address,
                    walletAccount.address,
                    hexlAccount.address
                ));
            }
            const args1 = [
                walletAccount.address,
                hexlAccount.address,
                input.tokenAmount
            ];
            ops.push({
                name: "depositToken",
                function: "transferFrom",
                args: args1,
                op: {
                    to: input.token.address,
                    value: EthBigNumber.from(0),
                    callData: erc20Interface.encodeFunctionData(
                        "transferFrom", args1
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
            const valid2 = await validAllowance(
                input.gasToken,
                walletAccount,
                hexlAccount,
                input.gasTokenAmount);
            if (!valid2) {
                txes.push(await buildApproveTx(
                    input.gasToken.address,
                    walletAccount.address,
                    hexlAccount.address
                ));
            }
            const args2 = [
                walletAccount.address,
                hexlAccount.address,
                input.gasTokenAmount
            ];
            ops.push({
                name: "depositToken",
                function: "transferFrom",
                args: args2,
                op: {
                    to: input.gasToken.address,
                    value: EthBigNumber.from(0),
                    callData: erc20Interface.encodeFunctionData(
                        "transferFrom", args2
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
        }
    }

    // refund from hexl account to refund account
    if (isNativeCoin(input.gasToken, chain)) {
        ops.push({
            name: "refundGasToken",
            function: "",
            args: [],
            op: {
                to: useChainStore().refunder,
                value: input.gasTokenAmount,
                callData: [],
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        });
    } else {
        const args = [
            hexlAccount.address,
            useChainStore().refunder,
            input.gasTokenAmount
        ];
        ops.push({
            name: "refundGasToken",
            function: "transferFrom",
            args,
            op: {
                to: input.gasToken.address,
                value: EthBigNumber.from(0),
                callData: erc20Interface.encodeFunctionData(
                    "transferFrom", args
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        });
    }
    ops = ops.concat(redPacketOps(input));

    const data = accountInterface.encodeFunctionData(
        "execBatch",
        [ops.map(op => op.op)]
    );
    txes.push({
        name: "createRedPacket",
        function: "execBatch",
        args: ops,
        tx: {
            to: hexlAccount.address,
            from: walletAccount.address,
            value: ethers.utils.hexValue(value),
            data,
        }
    });
    return txes;
}

export async function buildDeployAndCreateRedPacketTx(
    input: RedPacket,
    useHexlinkAccount: boolean
) : Promise<any> {
    const txes = await buildCreateRedPacketTx(input, useHexlinkAccount);
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
        tx: {
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
                    calcTokenAmount(input.balance, input.token),
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
        let txHash = await sendTransaction(txes[i].tx);
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
    const txes = await buildDeployAndCreateRedPacketTx(
        redpacket,
        useHexlinkAccount
    );
    return await processTxAndSave(redpacket, txes, dryrun);
}

export async function createNewRedPacket(
    redpacket: RedPacket,
    useHexlinkAccount: boolean,
    dryrun: boolean = false
) : Promise<string> {
    const txes = await buildCreateRedPacketTx(
        redpacket,
        useHexlinkAccount
    );
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