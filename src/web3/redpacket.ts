import type { Network, Account, UserOp, Token, RedPacket } from "@/types";
import { ethers, BigNumber as EthBigNumber } from "ethers";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { isNativeCoin, isWrappedCoin, isStableCoin } from "@/configs/tokens";

import { genDeployAuthProof } from "@/web3/oracle";
import { hash, toEthBigNumber, tokenBase, tokenEqual, addressEqual } from "@/web3/utils";
import { hexlinkAddress, hexlinkContract, refund } from "@/web3/hexlink";
import { estimateGas, sendTransaction } from "@/web3/wallet";

import ERC20_ABI from "@/configs/abi/ERC20.json";
import RED_PACKET_ABI from "@/configs/abi/HappyRedPacket.json";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import USERS from "@/configs/users.json";
import { useWalletStore } from "@/stores/wallet";
import { insertRedPacket, updateRedPacket } from "@/graphql/redpacket";
import { BigNumber } from "bignumber.js";

const erc20Iface = new ethers.utils.Interface(ERC20_ABI);
const redPacketIface = new ethers.utils.Interface(RED_PACKET_ABI);

function calcUsdCost(
    network: Network,
    gasAmount: EthBigNumber,
    gasToken: Token
) : EthBigNumber {
    const normalizedUsd = tokenBase(gasToken).times(network.nativeCurrency.priceInUsd);
    const nativeCoinBase = EthBigNumber.from(10).pow(network.nativeCurrency.decimals);
    return toEthBigNumber(normalizedUsd).mul(gasAmount).mul(
        network.defaultGasPrice
    ).div(nativeCoinBase);
}

export function estimateGasSponsorship(
    network: Network,
    redpacket: RedPacket
) : EthBigNumber {
    const sponsorshipGasAmount = EthBigNumber.from(redpacket.split).mul(200000);
    const gasToken = redpacket.gasToken;
    if (isNativeCoin(network, gasToken) || isWrappedCoin(network, gasToken)) {
        return sponsorshipGasAmount.mul(network.defaultGasPrice);
    } else if (isStableCoin(network, gasToken)) {
        return calcUsdCost(network, sponsorshipGasAmount, gasToken);
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
            to: redPacketAddr,
            value: packet.balance,
            callData: redPacketIface.encodeFunctionData(
                "create", [packet]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        }];
    } else {
        return [{
            to: input.token.metadata.address,
            value: EthBigNumber.from(0),
            callData: erc20Iface.encodeFunctionData(
                "approve", [redPacketAddr, packet.balance]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        },
        {
            to: redPacketAddr,
            value: EthBigNumber.from(0),
            callData: redPacketIface.encodeFunctionData(
                "create", [packet]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        }];
    }
}

function buildApproveTxes(
    network: Network,
    input: RedPacket
) {
    const walletAccount = useWalletStore().wallet!.account;
    const hexlAccount = useProfileStore().profile!.account;
    const tokenAmount = calcTokenAmount(input);
    const gasTokenAmount = estimateGasSponsorship(network, input);
    const txes : any[] = [];
    if (tokenEqual(input.token, input.gasToken)) {
        if (!isNativeCoin(network, input.token)) {
            const data = erc20Iface.encodeFunctionData(
                "approve", [
                    hexlAccount.address,
                    tokenAmount.add(gasTokenAmount)
                ]
            );
            txes.push({
                to: input.token.metadata.address,
                from: walletAccount.address,
                data,
            });
        }
    } else {
        if (!isNativeCoin(network, input.token)) {
            const data = erc20Iface.encodeFunctionData(
                "approve", [
                    hexlAccount.address,
                    tokenAmount
                ]
            );
            txes.push({
                to: input.token.metadata.address,
                from: walletAccount.address,
                data
            });
        }
        if (!isNativeCoin(network, input.gasToken)) {
            const data = erc20Iface.encodeFunctionData(
                "approve", [
                    hexlAccount.address,
                    gasTokenAmount
                ]
            );
            txes.push({
                to: input.gasToken.metadata.address,
                from: walletAccount.address,
                data
            });
        }
    }
    return txes;
}

function buildCreateRedPacketTx(
    network: Network,
    input: RedPacket,
    useHexlinkAccount: boolean
) {
    const walletAccount = useWalletStore().wallet!.account;
    const hexlAccount = useProfileStore().profile!.account;
    let value : EthBigNumber = EthBigNumber.from(0);
    let ops : UserOp[] = [];
    const from = useHexlinkAccount ? hexlAccount : walletAccount;

    const tokenAmount = calcTokenAmount(input);
    const gasTokenAmount = estimateGasSponsorship(network, input);
    let txes : any[] = [];

    if (!useHexlinkAccount) {
        console.log("----");
        txes = buildApproveTxes(network, input);
        console.log(txes);

        if (isNativeCoin(network, input.token)) {
            value = value.add(tokenAmount);
        } else {
            ops.push({
                to: input.token.metadata.address,
                value: EthBigNumber.from(0),
                callData: erc20Iface.encodeFunctionData(
                    "transferFrom", [
                        from.address,
                        hexlAccount.address,
                        tokenAmount
                    ]
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            });
        }
    }

    // refund from hexl account to refund account
    if (isNativeCoin(network, input.gasToken)) {
        if (!useHexlinkAccount) {
            value = value.add(gasTokenAmount);
        }
        ops.push({
            to: refund(network),
            value: gasTokenAmount,
            callData: [],
            callGasLimit: EthBigNumber.from(0) // no limit
        });
    } else {
        ops.push({
            to: input.gasToken.metadata.address,
            value: EthBigNumber.from(0),
            callData: erc20Iface.encodeFunctionData(
                "transferFrom", [
                    from.address,
                    refund(network),
                    gasTokenAmount
                ]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        });
    }

    ops = ops.concat(redPacketOps(network, input));
    const accountIface = new ethers.utils.Interface(ACCOUNT_ABI);
    const data = accountIface.encodeFunctionData("execBatch", [ops]);
    txes.push({
        to: hexlAccount.address,
        from: walletAccount.address,
        value: ethers.utils.hexValue(value),
        data,
    });
    return txes;
}

export async function buildDeployAndCreateRedPacketTx(
    network: Network,
    input: RedPacket,
    useHexlinkAccount: boolean
) : Promise<any> {
    const txes = buildCreateRedPacketTx(network, input, useHexlinkAccount);
    const tx = txes.pop();
    const { initData, proof } = await genDeployAuthProof(network, tx.last.data);
    const hexlink = hexlinkContract(network);
    const data = hexlink.interface.encodeFunctionData(
        "deploy", [useAuthStore().user!.nameHash, initData, {
            authType: hash(proof.authType),
            identityType: hash(proof.identityType),
            issuedAt: EthBigNumber.from(proof.issuedAt),
            signature: proof.signature
        }]
    );
    const walletAccount = useWalletStore().wallet!.account;
    return txes.push({
        to: hexlink.address,
        from: walletAccount.address,
        value: tx.value,
        data,
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
) : Promise<{id: string, tx: string}> {
    if (dryrun) {
        for (let i = 0; i < txes.length; i++) {
            const tx = txes[i];
            const gasUsed = await estimateGas(tx);
            console.log({
                tx: tx,
                gasUsed: EthBigNumber.from(gasUsed).toString()
            })
        }
        return {
            id: redpacketId(network, redpacket),
            tx: ''
        }
    }
    const id = redpacketId(network, redpacket);
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
        }
    }]);
    let tx : string = "";
    for (let i = 0; i < txes.length; i++) {
        let txHash = await sendTransaction(txes[i]);
        if (addressEqual(txes[i].to, hexlinkAddress(network))) {
            await updateRedPacket({id, tx});
            tx = txHash;
        }
    }
    return {id, tx};
}

export async function deployAndCreateNewRedPacket(
    network: Network,
    redpacket: RedPacket,
    useHexlinkAccount: boolean,
    dryrun: boolean
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
    dryrun: boolean
) : Promise<{id: string, tx: string}> {
    const txes = buildCreateRedPacketTx(
        network,
        redpacket,
        useHexlinkAccount
    );
    return await processTxAndSave(network, redpacket, txes, dryrun);
}
