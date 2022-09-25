import { getFunctions, httpsCallable } from 'firebase/functions'
import { Alchemy, Network, type TokenBalancesResponse } from "alchemy-sdk";
import BigNumber from "bignumber.js";
import type { Preference } from "@/services/graphql/preferences";

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
    symbol: string | null;
    decimals: number | null;
    name: string | null;
    logo?: string | null,
}

export interface TokenBalanceResponse {
    contractAddress?: string,
    tokenBalance: string | null,
    error?: any
}

export interface TokenBalance {
    value: BigNumber,
    error?: any,
    normalized: BigNumber,
}

export interface Token {
    address: string;
    metadata?: TokenMetadata;
    balance?: TokenBalance;
    preference?: Preference;
    price?: number;
}

export interface GasEstimation {
    baseCost: BigNumber,
    maxCost: BigNumber,
}

export async function getERC20Metadata(token: string) : Promise<Token> {
    const metadata = await alchemy.core.getTokenMetadata(token);
    return {
        address: token,
        metadata
    }
}

export async function getERC20Metadatas(tokens: string[]) : Promise<Token[]> {
    return await Promise.all(tokens.map(t => getERC20Metadata(t)));
}

export async function getETHBalance(wallet: string): Promise<TokenBalance> {
    const result = await alchemy.core.getBalance(wallet);
    return getBalance({tokenBalance: result.toHexString()}, 18);
}

export async function getERC20Balances(tokens: string[], wallet: string) : Promise<TokenBalanceResponse[]> {
    const data = await alchemy.core.getTokenBalances(
        wallet,
        tokens.map(t => t)
    );
    return data.tokenBalances;
}

function getBalance(balance: TokenBalanceResponse | null, decimals: number | null) : TokenBalance {
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

export async function loadAllERC20Tokens(
    defaultTokens: {[key: string]: TokenMetadata},
    preferences: Preference[],
    wallet: string
): Promise<Token[]> {
    const pMap = preferences.reduce((prev, p) => {
        prev[p.address] = p;
        return prev;
    }, {} as {[key: string]: Preference});

    const balances = await alchemy.core.getTokenBalances(wallet, 'erc20');
    const nonZeroBalances = balances.tokenBalances.reduce((prev, balance) => {
        if (balance.tokenBalance !== "0") {
            prev[balance.contractAddress.toLowerCase()] = balance;
        }
        return prev;
    }, {} as {[key: string]: TokenBalanceResponse});

    // get preferences not covered by default tokens
    const customTokenAddresses = preferences.filter(
        p => defaultTokens[p.address]
    ).map(p => p.address.toLowerCase());
    const customMetadatas = await getERC20Metadatas(customTokenAddresses);
    const customTokens = customMetadatas.reduce((prev, token) => {
        prev[token.address] = token
        return prev;
    }, {} as {[key: string]: Token});

    const tokens = Object.keys(defaultTokens).concat(customTokenAddresses);
    return tokens.map(address => {
        const metadata = defaultTokens[address] || customTokens[address].metadata;
        const token: Token = { address, metadata };
        if (pMap[address]) {
            token.preference = pMap[address];
        }
        if (nonZeroBalances[address]) {
            token.balance = getBalance(
                nonZeroBalances[address],
                metadata.decimals
            );
        }   
        return token;
    });
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
    amount: number
) : Promise<{txHash: string}> {
    if (token.address) {
        const sendERC20 = httpsCallable(functions, 'sendERC20');
        const result = await sendERC20({token, receiver, amount});
        return result.data as {txHash: string};
    } else {
        const sendETH = httpsCallable(functions, 'sendETH')
        const result = await sendETH({receiver, amount});
        return result.data as {txHash: string};
    }
}

export async function estimateERC20Transfer(
    token: Token,
    recevier: string,
    amount: number
) : Promise<GasEstimation> {
    const estimateFunc = httpsCallable(functions, 'estimateERC20Transfer')
    const result = await estimateFunc({token, recevier, amount});
    return result.data as GasEstimation;
}

export async function estimateETHTransfer() : Promise<GasEstimation> {
    const estimateFunc = httpsCallable(functions, 'estimateETHTransfer')
    const result = await estimateFunc();
    return result.data as GasEstimation;
}