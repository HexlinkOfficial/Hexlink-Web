import type { Network, Account, Transaction, UserOp, Token, RedPacket } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { isNativeCoin, isWrappedCoin, isStableCoin } from "@/configs/tokens";

import { genDeployAuthProof } from "@/web3/oracle";
import { hash, toEthBigNumber, tokenBase, tokenEqual } from "@/web3/utils";
import { hexlinkContract, refunder } from "@/web3/hexlink";
import { estimateGas, sendTransaction } from "@/web3/wallet";

import ERC20_ABI from "@/configs/abi/ERC20.json";
import RED_PACKET_ABI from "@/configs/abi/HappyRedPacket.json";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import USERS from "@/configs/users.json";
import { useWalletStore } from "@/stores/wallet";
import { insertRedPacket } from "@/graphql/redpacket";
import { BigNumber } from "bignumber.js";
import { getProvider, getPriceInfo } from "@/web3/network";
import { userInfo } from "@/web3/account";

const erc20Iface = new ethers.utils.Interface(ERC20_ABI);
const redPacketIface = new ethers.utils.Interface(RED_PACKET_ABI);

export async function estimateGasSponsorship(
    network: Network,
    redpacket: RedPacket
) : Promise<EthBigNumber> {
    const sponsorshipGasAmount = EthBigNumber.from(Number(redpacket.split)).mul(200000);
    const gasToken = redpacket.gasToken;
    const priceInfo = await getPriceInfo(network);
    if (isNativeCoin(network, gasToken) || isWrappedCoin(network, gasToken)) {
        return sponsorshipGasAmount.mul(priceInfo.gasPrice);
    } else if (isStableCoin(network, gasToken)) {
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
    const base = new BigNumber(10).pow(redpacket.token.metadata.decimals);
    return toEthBigNumber(base.times(redpacket.balance));
}

export function redPacketOps(
    network: Network,
    input: RedPacket
) : UserOp[] {
    const redPacketAddr = network.addresses.redPacket as string;
    const packet = {
       token: input.token.metadata.address,
       salt: input.salt,
       balance: calcTokenAmount(input),
       validator: USERS.redPacketValidator,
       split: input.split,
       mode: input.mode == "random" ? 2 : 1
    };
    if (isNativeCoin(network, input.token)) {
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
                to: input.token.metadata.address,
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
        token.metadata.address,
        ERC20_ABI,
        getProvider(network)
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
    const hexlAccount = useProfileStore().profile!.account;
    let ops : UserOp[] = [];
    const tokenAmount = calcTokenAmount(input);
    const gasTokenAmount = await estimateGasSponsorship(network, input);
    let txes : any[] = [];

    let value : EthBigNumber = EthBigNumber.from(0);
    if (!useHexlinkAccount) {
         if (isNativeCoin(network, input.token) && isNativeCoin(network, input.gasToken)) {
            value = value.add(tokenAmount).add(gasTokenAmount)
        } else if (isNativeCoin(network, input.token)) {
            value = value.add(tokenAmount);
            const valid = await validAllowance(
                network,
                input.gasToken,
                walletAccount,
                hexlAccount,
                gasTokenAmount);
            if (!valid) {
                txes.push(await buildApproveTx(
                    input.gasToken.metadata.address,
                    walletAccount.address,
                    hexlAccount.address
                ));
            }
            const args = [
                walletAccount.address,
                hexlAccount.address,
                gasTokenAmount
            ];
            ops.push({
                name: "depositGasToken",
                function: "transferFrom",
                args,
                op: {
                    to: input.gasToken.metadata.address,
                    value: EthBigNumber.from(0),
                    callData: erc20Iface.encodeFunctionData(
                        "transferFrom", args
                    ),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            });
        } else if (isNativeCoin(network, input.gasToken)) {
            value = value.add(gasTokenAmount);
            const valid = await validAllowance(
                network,
                input.token,
                walletAccount,
                hexlAccount,
                tokenAmount);
            if (!valid) {
                txes.push(await buildApproveTx(
                    input.token.metadata.address,
                    walletAccount.address,
                    hexlAccount.address
                ));
            }
            const args = [
                walletAccount.address,
                hexlAccount.address,
                tokenAmount
            ];
            ops.push({
                name: "depositToken",
                function: "transferFrom",
                args,
                op: {
                    to: input.token.metadata.address,
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
                tokenAmount.add(gasTokenAmount));
            if (!valid) {
                txes.push(await buildApproveTx(
                    input.token.metadata.address,
                    walletAccount.address,
                    hexlAccount.address
                ));
            }
            const args = [
                walletAccount.address,
                hexlAccount.address,
                tokenAmount.add(gasTokenAmount)
            ];
            ops.push({
                name: "depositTokenAndGasToken",
                function: "transferFrom",
                args,
                op: {
                    to: input.token.metadata.address,
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
                tokenAmount);
            if (!valid1) {
                txes.push(await buildApproveTx(
                    input.token.metadata.address,
                    walletAccount.address,
                    hexlAccount.address
                ));
            }
            const args1 = [
                walletAccount.address,
                hexlAccount.address,
                tokenAmount
            ];
            ops.push({
                name: "depositToken",
                function: "transferFrom",
                args: args1,
                op: {
                    to: input.token.metadata.address,
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
                gasTokenAmount);
            if (!valid2) {
                txes.push(await buildApproveTx(
                    input.gasToken.metadata.address,
                    walletAccount.address,
                    hexlAccount.address
                ));
            }
            const args2 = [
                walletAccount.address,
                hexlAccount.address,
                gasTokenAmount
            ];
            ops.push({
                name: "depositToken",
                function: "transferFrom",
                args: args2,
                op: {
                    to: input.gasToken.metadata.address,
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
    if (isNativeCoin(network, input.gasToken)) {
        ops.push({
            name: "refundGasToken",
            function: "",
            args: [],
            op: {
                to: refunder(network),
                value: gasTokenAmount,
                callData: [],
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        });
    } else {
        const args = [
            hexlAccount.address,
            refunder(network),
            gasTokenAmount
        ];
        ops.push({
            name: "refundGasToken",
            function: "transferFrom",
            args,
            op: {
                to: input.gasToken.metadata.address,
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
    const { initData, proof } = await genDeployAuthProof(network, tx.last.data);
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
    return txes.push({
        name: "deployAndCreateRedPacket",
        function: "deploy",
        args,
        tx: {
            to: hexlink.address,
            from: walletAccount.address,
            value: tx.value,
            data,
        }
    });
}

function redpacketId(network: Network, input: RedPacket) {
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["uint256", "address", "address", "address", "bytes32"],
            [
                network.chainId,
                network.addresses.redPacket,
                useProfileStore().account.address,
                input.token.metadata.address,
                input.salt
            ]
        )
    )
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

    for (let i = 0; i < txes.length; i++) {
        let txHash = await sendTransaction(txes[i].tx);
        if (txes[i].name == "createRedPacket" || txes[i].name == "deployAndCreateRedPacket") {
            await insertRedPacket([{
                id,
                chain: network.name,
                metadata: {
                    token: redpacket.token.metadata.address,
                    salt: redpacket.salt,
                    split: redpacket.split,
                    balance: redpacket.balance,
                    mode: redpacket.mode,
                    validator: network.addresses.validator as string,
                    expiredAt: 0,
                    contract: network.addresses.redPacket as string
                },
                creator: userInfo(),
                tx: txHash
            }]);
        }
    }
    return id;
}

export async function deployAndCreateNewRedPacket(
    network: Network,
    redpacket: RedPacket,
    useHexlinkAccount: boolean,
    dryrun: boolean = false
) {
    const txes = await buildDeployAndCreateRedPacketTx(
        network,
        redpacket,
        useHexlinkAccount
    );
    return await processTxAndSave(network, redpacket, txes, dryrun);
}

export async function createNewRedPacket(
    network: Network,
    redpacket: RedPacket,
    useHexlinkAccount: boolean,
    dryrun: boolean = false
) : Promise<string> {
    const txes = await buildCreateRedPacketTx(
        network,
        redpacket,
        useHexlinkAccount
    );
    return await processTxAndSave(network, redpacket, txes, dryrun);
}