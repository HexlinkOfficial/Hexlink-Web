import { getFunctions, httpsCallable } from 'firebase/functions'
import * as ethers from 'ethers';
import { Alchemy, Network, type AssetTransfersWithMetadataParams, type AssetTransfersWithMetadataResult } from "alchemy-sdk";
import BigNumber from "bignumber.js";
import TOKEN_LIST from '@/data/TOKENS.json';
import {
    getERC20Preferences,
    setERC20Preferences
} from '@/services/graphql/preferences';
import type {
    PreferenceOutput,
    PreferenceInput,
    Preference
} from "@/services/graphql/preferences";
import type { IAuth } from '@/stores/auth';
import type { TokenBalance } from "alchemy-sdk";
import { TokenBalanceType } from "alchemy-sdk";
import type { TokenBalancesOptionsErc20 } from "alchemy-sdk";

const functions = getFunctions();

const config = {
    apiKey: import.meta.env.VITE_GOERLI_ALCHEMY_KEY,
    network: getNetwork(),
};
const alchemy = new Alchemy(config);

function getNetwork() : Network {
    if (import.meta.env.VITE_HARDHAT_NETWORK == 'goerli') {
        return Network.ETH_GOERLI; 
    }
    return Network.ETH_MAINNET;
}

export interface TokenMetadata {
    symbol: string;
    decimals: number;
    name: string;
    logo?: string;
}

export interface NormalizedTokenBalance {
    value: BigNumber;
    error?: any;
    normalized: BigNumber;
}

export interface Token {
    address: string;
    metadata: TokenMetadata;
    balance?: NormalizedTokenBalance;
    preference?: Preference;
    price?: number;
}

export interface GasEstimation {
    baseCost: BigNumber;
    maxCost: BigNumber;
}

export async function getERC20Metadata(token: string) : Promise<Token> {
    const metadata = await alchemy.core.getTokenMetadata(token);
    if (metadata.name == null
        || metadata.symbol == null
        || metadata.decimals == null) {
        throw new Error(
            `Invalid ERC20 metadata for ${token}, got ${JSON.stringify(metadata)}`
        )
    }
    return {
        address: token,
        metadata: {
            name: metadata.name!,
            symbol: metadata.symbol!,
            decimals: metadata.decimals!
        }
    }
}

export async function getERC20Metadatas(tokens: string[]) : Promise<Token[]> {
    return await Promise.all(tokens.map(t => getERC20Metadata(t)));
}

export async function getETHBalance(wallet: string): Promise<TokenBalance> {
    const result = await alchemy.core.getBalance(wallet);
    return {
        contractAddress: "0x",
        tokenBalance: result.toHexString(),
        error: null,
    };
}

export async function getERC20Balances(tokens: string[], wallet: string) : Promise<TokenBalance[]> {
    const data = await alchemy.core.getTokenBalances(
        wallet,
        tokens.map(t => t)
    );
    return data.tokenBalances;
}

function getBalance(balance: TokenBalance | null, decimals: number | null) : NormalizedTokenBalance {
    const base = {
        value: BigNumber(balance?.tokenBalance || 0),
        error: balance?.error,
    }
    if (!balance || balance.error || balance.tokenBalance == null || decimals == null) {
        return {
            ...base,
            normalized: BigNumber(0)
        }
    }
    const normalized = new BigNumber(balance.tokenBalance).div(BigNumber(10).pow(decimals));
    if (normalized.gt(1)) {
        return {
            ...base,
            normalized: normalized.dp(5)
        };
    } else {
        return {
            ...base,
            normalized
        }
    }
}

export async function getAllVisiableTokens(store: IAuth) {
    const tokens: {[key: string]: Token} = {};
    const preferences : PreferenceOutput[] = await getERC20Preferences(
        store.currentUser!,
        store.idToken!,
        Number(import.meta.env.VITE_CHAIN_ID),
    );
    const customTokenAddresses : string[] = [];
    preferences.forEach(preference => {
        const address = preference.address.toLowerCase();
        if (preference.display) {
            const metadata = (TOKEN_LIST as any)[address];
            if (metadata) {
                tokens[address] = { address, metadata, preference }
            } else {
                customTokenAddresses.push(address);
                tokens[address] = {
                    address,
                    metadata: {name: "", symbol: "", decimals: 18},
                    preference
                }
            }
        }
    });
    const customMetadatas = await getERC20Metadatas(customTokenAddresses);
    customMetadatas.forEach(token => {
        tokens[token.address].metadata = token.metadata;
    });
    return tokens;
}

export async function loadAll(
    store: IAuth,
    wallet: string
): Promise<{[key: string]: Token}> {
    const tokens: {[key: string]: Token} = {};
    Object.keys(TOKEN_LIST).forEach(address => {
        tokens[address] = {
            address,
            metadata: (TOKEN_LIST as any)[address]
        }
    });

    const preferences : PreferenceOutput[] = await getERC20Preferences(
        store.currentUser!,
        store.idToken!,
        Number(import.meta.env.VITE_CHAIN_ID),
    );
    const customTokenAddresses : string[] = [];
    preferences.forEach(p => {
        const address = p.address.toLowerCase();
        if (tokens[address]) {
            tokens[address].preference = p;
        } else {
            customTokenAddresses.push(address)
            tokens[address] = {
                address,
                metadata: {name: "", symbol: "", decimals: 0},
                preference: p,
            }
        }
    });

    const customMetadatas = await getERC20Metadatas(customTokenAddresses);
    customMetadatas.forEach(token => {
        tokens[token.address].metadata = token.metadata;
    });

    const tokensToSetPreference : PreferenceInput[] = [];
    const ethBalance = await getETHBalance(wallet);
    const option: TokenBalancesOptionsErc20 = {type : TokenBalanceType.ERC20};
    const erc20Balances = await alchemy.core.getTokenBalances(wallet, option);
    erc20Balances.tokenBalances.concat([ethBalance as TokenBalance]).forEach(balance => {
        if (BigNumber(balance.tokenBalance || 0).gt(0)) {
            const address = balance.contractAddress.toLowerCase();
            tokens[address].balance = getBalance(
                balance,
                tokens[address].metadata.decimals
            );
            if (!tokens[address].preference) {
                tokensToSetPreference.push({
                    chainId: import.meta.env.VITE_CHAIN_ID,
                    address,
                    display: true
                });
            }
        }
    });
    const newPreferences = await setERC20Preferences(
        store.currentUser!,
        store.idToken!,
        tokensToSetPreference
    );
    newPreferences.forEach(p => {
        tokens[p.address].preference = {id: p.id, display: p.display};
    });
    return tokens;
}

export async function loadERC20Token(
    address: string,
    wallet: string
): Promise<Token> {
    const token = await getERC20Metadata(address);
    const balances = await alchemy.core.getTokenBalances(wallet, [address]);
    const [balance] = balances.tokenBalances;
    token.balance = getBalance(balance, token.metadata!.decimals);
    return token;
}

export async function send(
    token: Token,
    receiver: string,
    amount: string
) : Promise<{txHash: string}> {
    if (token.address == '0x') {
        const amountToSend = ethers.utils.parseEther(amount);
        const sendETH = httpsCallable(functions, 'sendETH')
        const result = await sendETH({receiver, amount: amountToSend.toString()});
        return result.data as {txHash: string};
    } else {
        const sendERC20 = httpsCallable(functions, 'sendERC20');
        const normalized = BigNumber(10).pow(token.metadata.decimals).times(amount);
        const result = await sendERC20({
            token,
            receiver,
            amount: normalized.toFixed(0, 1).toString(),
        });
        return result.data as {txHash: string};
    }
}

export async function estimateERC20Transfer(
    token: Token,
    recevier: string,
    amount: number
) : Promise<GasEstimation> {
    const estimateFunc = httpsCallable(functions, 'estimateERC20Transfer')
    const result = await estimateFunc({
        tokenAddress: token.address,
        recevier,
        amount
    });
    return result.data as GasEstimation;
}

export async function estimateETHTransfer() : Promise<GasEstimation> {
    const estimateFunc = httpsCallable(functions, 'estimateETHTransfer')
    const result = await estimateFunc();
    return result.data as GasEstimation;
}

export interface Transaction {
    hash: string;
    blockNumber: number;
    timestamp?: string;
    position?: number;
}

export interface Action {
    type: "send" | "receive",
    from?: string | null,
    to?: string | null,
}

export interface AssetTransfer {
    tx: Transaction;
    asset: Token;
    amount: {
        value: BigNumber,
        normalized: BigNumber,
    };
    action: Action;
}

const transferAction = (wallet: string, transfer: AssetTransfersWithMetadataResult) => {
    if (transfer.from.toLowerCase() == wallet) {
        return {
            type: "send",
            to: transfer.to,
        } as Action;
    } else if (transfer.to?.toLowerCase() == wallet) {
        return {
            type: "receive",
            from: transfer.from,
        } as Action;
    } else {
        throw new Error("Unknown transaction " + JSON.stringify(transfer));
    }
};

const toAssetTransfer = (
    wallet: string,
    transfer: AssetTransfersWithMetadataResult
) : AssetTransfer => {
    return {
        tx: {
            hash: transfer.hash,
            blockNumber: Number(transfer.blockNum),
            timestamp: transfer.metadata.blockTimestamp,
        },
        asset: {
            address: transfer.rawContract.address || "",
            metadata: {
                decimals: Number(transfer.rawContract.decimal) || -1,
                symbol: transfer.asset || "",
                name: "",
            }
        } as Token,
        amount: {
            value: BigNumber(transfer.rawContract.value || 0),
            normalized: BigNumber(transfer.value || 0),
        },
        action: transferAction(wallet, transfer),
    }
}

export async function getAssetTransfers(input: {
    wallet: string,
    category: string[],
    order?: string,
    contractAddresses?: string[]
}) : Promise<AssetTransfer[]> {
    const order = input.order || 'desc';
    const category = input.category || ['erc20', 'erc721'];
    let params = { category, order, withMetadata: true} as AssetTransfersWithMetadataParams;
    if (input.contractAddresses && input.contractAddresses.length > 0) {
        params.contractAddresses = input.contractAddresses;
    }
    const [send, receive] = await Promise.all([
        alchemy.core.getAssetTransfers({fromAddress: input.wallet, ...params}),
        alchemy.core.getAssetTransfers({toAddress: input.wallet, ...params}),
    ]);
    const transfers = send.transfers.concat(receive.transfers).map(
        t => toAssetTransfer(input.wallet, t)
    );
    transfers.sort((a, b) => a.tx.blockNumber - b.tx.blockNumber).slice(0, 1000);
    return transfers;
}