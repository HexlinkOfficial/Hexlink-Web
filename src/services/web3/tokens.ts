import type { AssetTransfersWithMetadataParams, AssetTransfersWithMetadataResult } from "alchemy-sdk";
import BigNumber from "bignumber.js";
import {
    getTokenPreferences,
    insertTokenPreferences
} from '@/services/graphql/preference';
import type {
    PreferenceOutput,
    PreferenceInput,
} from "@/services/graphql/preference";
import type { TokenMetadata, Token, Network, NormalizedTokenBalance } from '@/types';
import type { TokenBalance } from "alchemy-sdk";
import { TokenBalanceType } from "alchemy-sdk";
import type { TokenBalancesOptionsErc20 } from "alchemy-sdk";
import { useAuthStore } from "@/stores/auth";
import { useNetworkStore } from '@/stores/network';
import { getPopularTokens, nativeCoinAddress } from "@/configs/tokens";
import { alchemy } from "@/services/web3/network";

export interface GasEstimation {
    baseCost: BigNumber;
    maxCost: BigNumber;
}

export async function getERC20Metadata(token: string) : Promise<TokenMetadata> {
    const metadata = await alchemy().core.getTokenMetadata(token);
    if (metadata.name == null
        || metadata.symbol == null
        || metadata.decimals == null) {
        throw new Error(
            `Invalid ERC20 metadata for ${token}, got ${JSON.stringify(metadata)}`
        )
    }
    return {
        address: token,
        name: metadata.name!,
        symbol: metadata.symbol!,
        decimals: metadata.decimals!,
        logoURI: metadata.logo!
    }
}

async function getERC20Metadatas(tokens: string[]) : Promise<TokenMetadata[]> {
    return await Promise.all(tokens.map(t => getERC20Metadata(t)));
}

async function getNativeCoinBalance(wallet: string, network: Network): Promise<TokenBalance> {
    const result = await alchemy().core.getBalance(wallet);
    return {
        contractAddress: nativeCoinAddress(network),
        tokenBalance: result.toHexString(),
        error: null,
    };
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

export async function loadAll(): Promise<{[key: string]: Token}> {
    const auth = useAuthStore();

    const tokens: {[key: string]: Token} = {};
    const network = useNetworkStore().network;
    const DEFAULT_TOKENS = await getPopularTokens(network);
    DEFAULT_TOKENS.tokens.forEach(t => tokens[t.address] = {metadata: t});

    const preferences : PreferenceOutput[] = await getTokenPreferences(
        auth.user!, network
    );
    const customTokenAddresses : string[] = [];
    preferences.forEach(p => {
        const address = p.token_address.toLowerCase();
        if (tokens[address]) {
            tokens[address].preference = p;
        } else {
            customTokenAddresses.push(address)
            tokens[address] = {
                metadata: {
                    address, 
                    name: "",
                    symbol: "",
                    decimals: 0,
                },
                preference: p,
            }
        }
    });

    const customMetadatas = await getERC20Metadatas(customTokenAddresses);
    customMetadatas.forEach(metadata => {
        tokens[metadata.address].metadata = metadata;
    });

    const tokensToSetPreference : PreferenceInput[] = [];
    const account = auth.user!.account.address;
    const ethBalance = await getNativeCoinBalance(account, network);
    const option: TokenBalancesOptionsErc20 = {type : TokenBalanceType.ERC20};
    const erc20Balances = await alchemy().core.getTokenBalances(account, option);

    erc20Balances.tokenBalances.concat([ethBalance as TokenBalance]).forEach(balance => {
        if (BigNumber(balance.tokenBalance || 0).gt(0)) {
            const address = balance.contractAddress.toLowerCase();
            tokens[address].balance = getBalance(
                balance,
                tokens[address].metadata.decimals
            );
            if (!tokens[address].preference) {
                tokensToSetPreference.push({
                    chain: network.chainId.toString(),
                    token_address: address,
                    display: true
                });
            }
        }
    });
    const inserted = await insertTokenPreferences(auth.user!, tokensToSetPreference);
    tokensToSetPreference.forEach((p, i) => {
        tokens[p.token_address].preference = {id: inserted[i].id, display: p.display};
    });
    return tokens;
}

export async function loadERC20Token(
    address: string,
    wallet: string
): Promise<Token> {
    const token = await getERC20Metadata(address);
    const balances = await alchemy().core.getTokenBalances(wallet, [address]);
    const [balance] = balances.tokenBalances;
    return {
        metadata: token,
        balance: getBalance(balance, token.decimals)
    };
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
    asset: TokenMetadata;
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
            decimals: Number(transfer.rawContract.decimal) || -1,
            symbol: transfer.asset || "",
            name: "",
        } as TokenMetadata,
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
        alchemy().core.getAssetTransfers({fromAddress: input.wallet, ...params}),
        alchemy().core.getAssetTransfers({toAddress: input.wallet, ...params}),
    ]);
    const transfers = send.transfers.concat(receive.transfers).map(
        t => toAssetTransfer(input.wallet, t)
    );
    transfers.sort((a, b) => a.tx.blockNumber - b.tx.blockNumber).slice(0, 1000);
    return transfers;
}