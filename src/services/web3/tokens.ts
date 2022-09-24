import { getFunctions, httpsCallable } from 'firebase/functions'
import { Alchemy, Network } from "alchemy-sdk";
import BigNumber from "bignumber.js";
import { parseEther } from '@ethersproject/units';
import type { ethers } from 'ethers';

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
    logo: string | null,
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

export interface Token extends TokenMetadata {
    address: string,
    balance: TokenBalance,
    price?: number;
}

export interface GasEstimation {
    baseCost: BigNumber,
    maxCost: BigNumber,
}

export const DEFAULT_BALANCE = {
    value: BigNumber(0),
    normalized: BigNumber(0)
}

export const DEFAULT_TOKEN = {
    address: "",
    decimals: 18,
    balance: DEFAULT_BALANCE,
    normalizedBalance: "0",
    symbol: "",
    logo: "",
    name: "",
    price: 1,
};

export async function getERC20Metadata(token: string) : Promise<TokenMetadata> {
    return await alchemy.core.getTokenMetadata(token);
}

export async function getERC20Metadatas(tokens: string[]) : Promise<TokenMetadata[]> {
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

function getBalance(balance: TokenBalanceResponse, decimals: number | null) : TokenBalance {
    const base = {
        value: BigNumber(balance.tokenBalance || 0),
        error: balance.error,
    }
    if (balance.error || balance.tokenBalance == null || decimals == null) {
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

export async function loadTokenDetails(tokens: string[], wallet: string): Promise<Token[]> {
    return await Promise.all([
        getERC20Balances(tokens, wallet),
        getERC20Metadatas(tokens)
    ]).then(([balances, metadatas]) => {
        return tokens.map((address, i) => (
            {
                ...(metadatas[i]),
                balance: getBalance(balances[i], metadatas[i].decimals),
                address,
                price: 1
            }
        ));
    });
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