import type { Network, Account, Transaction, UserOp, Token, RedPacket, RedPacketDB } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useAuthStore } from "@/stores/auth";
import { isNativeCoin, isWrappedCoin, isStableCoin } from "@/configs/tokens";

import { genDeployAuthProof } from "@/web3/oracle";
import { hash, toEthBigNumber, tokenBase, tokenEqual } from "@/web3/utils";
import { hexlinkContract, refunder } from "@/web3/hexlink";
import { estimateGas, sendTransaction } from "@/web3/wallet";

import ERC20_ABI from "@/configs/abi/ERC20.json";
import RED_PACKET_ABI from "@/configs/abi/HappyRedPacket.json";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import { useWalletStore } from "@/stores/wallet";
import { useNetworkStore } from "@/stores/network";
import { insertRedPacket } from "@/graphql/redpacket";
import { BigNumber } from "bignumber.js";
import { getInfuraProvider, getPriceInfo } from "@/web3/network";
import { getNetwork } from "@/configs/network";
import { updateRedPacketClaimer } from "@/graphql/redpacketClaim";
import { useAccountStore } from "@/stores/account";

import { getFunctions, httpsCallable } from 'firebase/functions'
const functions = getFunctions();

const erc20Iface = new ethers.utils.Interface(ERC20_ABI);
const redPacketIface = new ethers.utils.Interface(RED_PACKET_ABI);

export function validator(network?: Network) : string {
    network = network || useNetworkStore().network!;
    if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR) {
        return network.address.testValidator as string;
    }
    return network.address.validator as string;
}

function redPacketMode(mode: string) : number {
    return mode == "random" ? 2 : 1;
}

export function redPacketContract(contract?: string, network?: Network) {
    network = network || useNetworkStore().network;
    return new ethers.Contract(
        contract || network!.address.redpacket as string,
        RED_PACKET_ABI,
        getInfuraProvider(network)
    );
}

export async function estimateGasSponsorship(
    network: Network,
    redpacket: RedPacket
) : Promise<EthBigNumber> {
    const sponsorshipGasAmount = EthBigNumber.from(Number(redpacket.split)).mul(200000);
    const gasToken = redpacket.gasToken;
    const priceInfo = await getPriceInfo(network);
    if (isNativeCoin(gasToken, network) || isWrappedCoin(gasToken, network)) {
        return sponsorshipGasAmount.mul(priceInfo.gasPrice);
    } else if (isStableCoin(gasToken, network)) {
        // calculate usd value of tokens
        const normalizedUsd = tokenBase(gasToken).times(priceInfo.nativeCurrencyInUsd);
        const nativeCoinBase = EthBigNumber.from(10).pow(network.nativeCurrency.decimals);
        return toEthBigNumber(normalizedUsd).mul(sponsorshipGasAmount).mul(
            priceInfo.gasPrice
        ).div(nativeCoinBase);
    }
    throw new Error("Unsupported gas token");
}

export function calcTokenAmount(
    redpacket: RedPacket
) : EthBigNumber {
    const base = new BigNumber(10).pow(redpacket.token.decimals);
    return toEthBigNumber(base.times(redpacket.balance));
}

export function redPacketOps(
    network: Network,
    input: RedPacket
) : UserOp[] {
    const redPacketAddr = network.address.redpacket as string;
    const packet = {
       token: input.token.address,
       salt: input.salt,
       balance: calcTokenAmount(input),
       validator: input.validator,
       split: input.split,
       mode: redPacketMode(input.mode),
    };
    if (isNativeCoin(input.token, network)) {
        return [{
            name: "createRedPacket",
            function: "create",
            args: [packet],
            op: {
                to: redPacketAddr,
                value: packet.balance,
                callData: redPacketIface.encodeFunctionData(
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
                callData: erc20Iface.encodeFunctionData(
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
                callData: redPacketIface.encodeFunctionData(
                    "create", [packet]
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        }];
    }
}

async function validAllowance(
    network: Network,
    token: Token,
    owner: Account,
    operator: Account,
    requiredAmount: EthBigNumber
) {
    const erc20 = new ethers.Contract(
        token.address,
        ERC20_ABI,
        getInfuraProvider(network)
    );
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
    const data = erc20Iface.encodeFunctionData(
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
    network: Network,
    input: RedPacket,
    useHexlinkAccount: boolean
) {
    const walletAccount = useWalletStore().wallet!.account;
    const hexlAccount = useAccountStore().account!;
    let ops : UserOp[] = [];
    let txes : any[] = [];
    let value : EthBigNumber = EthBigNumber.from(0);
    input.tokenAmount = calcTokenAmount(input);
    input.gasTokenAmount = await estimateGasSponsorship(network, input);
    if (!useHexlinkAccount) {
         if (isNativeCoin(input.token, network) && isNativeCoin(input.gasToken, network)) {
            value = value.add(input.tokenAmount).add(input.gasTokenAmount)
        } else if (isNativeCoin(input.token, network)) {
            value = value.add(input.tokenAmount);
            const valid = await validAllowance(
                network,
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
                    callData: erc20Iface.encodeFunctionData(
                        "transferFrom", args
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
        } else if (isNativeCoin(input.gasToken, network)) {
            value = value.add(input.gasTokenAmount);
            const valid = await validAllowance(
                network,
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
                    callData: erc20Iface.encodeFunctionData(
                        "transferFrom", args
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
        } else if (tokenEqual(input.token, input.gasToken)) {
            const valid = await validAllowance(
                network,
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
                    callData: erc20Iface.encodeFunctionData(
                        "transferFrom", args
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
        } else {
            const valid1 = await validAllowance(
                network,
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
                    callData: erc20Iface.encodeFunctionData(
                        "transferFrom", args1
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
            const valid2 = await validAllowance(
                network,
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
                    callData: erc20Iface.encodeFunctionData(
                        "transferFrom", args2
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
        }
    }

    // refund from hexl account to refund account
    if (isNativeCoin(input.gasToken, network)) {
        ops.push({
            name: "refundGasToken",
            function: "",
            args: [],
            op: {
                to: refunder(network),
                value: input.gasTokenAmount,
                callData: [],
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        });
    } else {
        const args = [
            hexlAccount.address,
            refunder(network),
            input.gasTokenAmount
        ];
        ops.push({
            name: "refundGasToken",
            function: "transferFrom",
            args,
            op: {
                to: input.gasToken.address,
                value: EthBigNumber.from(0),
                callData: erc20Iface.encodeFunctionData(
                    "transferFrom", args
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        });
    }
    ops = ops.concat(redPacketOps(network, input));

    const accountIface = new ethers.utils.Interface(ACCOUNT_ABI);
    const data = accountIface.encodeFunctionData(
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
    network: Network,
    input: RedPacket,
    useHexlinkAccount: boolean
) : Promise<any> {
    const txes = await buildCreateRedPacketTx(network, input, useHexlinkAccount);
    const tx = txes.pop(); // last tx is the redpacket creation tx
    const { initData, proof } = await genDeployAuthProof(network, tx.tx.data);
    const hexlink = hexlinkContract(network);
    const args = [useAuthStore().user!.nameHash, initData, {
        authType: hash(proof.authType),
        identityType: hash(proof.identityType),
        issuedAt: EthBigNumber.from(proof.issuedAt),
        signature: proof.signature
    }];
    const data = hexlink.interface.encodeFunctionData(
        "deploy", args
    );
    const walletAccount = useWalletStore().wallet!.account;
    txes.push({
        name: "deployAndCreateRedPacket",
        function: "deploy",
        args,
        tx: {
            to: hexlink.address,
            from: walletAccount.address,
            value: tx.tx.value,
            data,
        }
    });
    return txes;
}

function redpacketId(network: Network, input: RedPacket) {
    const redPacketType = "tuple(address,bytes32,uint256,address,uint32,uint8)";
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["uint256", "address", "address", redPacketType],
            [
                Number(network.chainId),
                network.address.redpacket as string,
                useAccountStore().account!.address,
                [
                    input.token.address,
                    input.salt,
                    calcTokenAmount(input),
                    input.validator,
                    input.split,
                    redPacketMode(input.mode)
                ]
            ]
        )
    );
}

async function processTxAndSave(
    network: Network,
    redpacket: RedPacket,
    txes: any[],
    dryrun: boolean
) : Promise<string> {
    const id = redpacketId(network, redpacket);
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
        chain: network.chainId.toString(),
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
            contract: network.address.redpacket as string,
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
    const network = useNetworkStore().network!;
    const txes = await buildDeployAndCreateRedPacketTx(
        network,
        redpacket,
        useHexlinkAccount
    );
    return await processTxAndSave(network, redpacket, txes, dryrun);
}

export async function createNewRedPacket(
    redpacket: RedPacket,
    useHexlinkAccount: boolean,
    dryrun: boolean = false
) : Promise<string> {
    const network = useNetworkStore().network!;
    const txes = await buildCreateRedPacketTx(
        network,
        redpacket,
        useHexlinkAccount
    );
    return await processTxAndSave(network, redpacket, txes, dryrun);
}

export async function claimRedPacket(redPacket: RedPacketDB) : Promise<void> {
    const claimRedPacket = httpsCallable(functions, 'claimRedPacket');
    const network = getNetwork(redPacket.chain);
    const result = await claimRedPacket({chainId: network.chainId, redPacketId: redPacket.id});
    const {id} = result.data as {id: number, tx: string};
    await updateRedPacketClaimer(id, useAuthStore().userInfo);
}

export async function queryRedPacketInfo(redPacket: RedPacketDB) : Promise<{
    balance: EthBigNumber,
    split: number,
    createdAt: Date
}> {
    const info = await redPacketContract(
        redPacket.metadata.contract
    ).getPacket(redPacket.id);
    return {
        createdAt: new Date(info.createdAt.toNumber() * 1000),
        balance: info.balance,
        split: info.split
    }
}