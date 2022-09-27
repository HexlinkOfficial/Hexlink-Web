import { getFunctions, httpsCallable } from 'firebase/functions'
import { Alchemy, Network } from "alchemy-sdk";
import BigNumber from "bignumber.js";
import type { PreferenceOutput, PreferenceInput, Preference } from "@/services/graphql/preferences";

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
    logo?: string | null;
}

export interface TokenBalanceResponse {
    contractAddress?: string;
    tokenBalance: string | null;
    error?: any;
}

export interface TokenBalance {
    value: BigNumber;
    error?: any;
    normalized: BigNumber;
}

export interface Token {
    address: string;
    metadata?: TokenMetadata;
    balance?: TokenBalance;
    preference?: Preference;
    price?: number;
}

export interface GasEstimation {
    baseCost: BigNumber;
    maxCost: BigNumber;
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

export async function getETHBalance(wallet: string): Promise<TokenBalanceResponse> {
    const result = await alchemy.core.getBalance(wallet);
    return {tokenBalance: result.toHexString()};
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
    preferences: PreferenceOutput[],
    wallet: string
): Promise<{
    tokens: Token[],
    tokensToSetPreference: PreferenceInput[],
}> {
    const nonZeroBalances : {[key: string]: TokenBalanceResponse} = {};
    const ethBalance = await getETHBalance(wallet);
    if (BigNumber(ethBalance.tokenBalance!).gt(0)) {
        nonZeroBalances["0x"] = ethBalance;
    }

    const customTokenAddresses = preferences.filter(
        p => !defaultTokens[p.address]
    ).map(p => p.address.toLowerCase());
    const toSearch = Object.keys(defaultTokens).filter(
        addr => addr != '0x'
    ).concat(customTokenAddresses);
    const erc20Balances = await alchemy.core.getTokenBalances(wallet, toSearch);
    erc20Balances.tokenBalances.forEach(balance => {
        if (balance.tokenBalance !== "0") {
            nonZeroBalances[balance.contractAddress.toLowerCase()] = balance;
        }
    });

    const customMetadatas = await getERC20Metadatas(customTokenAddresses);
    const customTokens = customMetadatas.reduce((prev, token) => {
        prev[token.address] = token
        return prev;
    }, {} as {[key: string]: Token});

    const pMap = preferences.reduce((prev, p) => {
        prev[p.address] = {
            id: p.id,
            display: p.display,
            displayName: p.displayName,
        };
        return prev;
    }, {} as {[key: string]: Preference});

    const tokenAddresses = Object.keys(defaultTokens).concat(customTokenAddresses);
    const tokensToSetPreference : PreferenceInput[] = [];
    const tokens = tokenAddresses.map(address => {
        const metadata = defaultTokens[address] || customTokens[address].metadata;
        const token: Token = { address, metadata };
        if (nonZeroBalances[address]) {
            token.balance = getBalance(
                nonZeroBalances[address],
                metadata.decimals
            );
        }
        if (pMap[address]) {
            token.preference = pMap[address];
        } else {
            if (token.balance?.value.gt(0)) {
                tokensToSetPreference.push({
                    chainId: Number(import.meta.env.VITE_CHAIN_ID),
                    address: token.address,
                    display: true,
                });
            }
        }
        return token;
    });
    return {
        tokens,
        tokensToSetPreference
    }
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