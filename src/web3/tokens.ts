import type { AssetTransfersWithMetadataParams, AssetTransfersWithMetadataResult } from "alchemy-sdk";
import BigNumber from "bignumber.js";
import {
    getTokenPreferences,
    insertTokenPreferences
} from '@/graphql/preference';
import type {
    PreferenceInput,
} from "@/graphql/preference";
import type {
    Token,
    Network,
    NormalizedTokenBalance
} from '@/types';
import { getPopularTokens } from "@/configs/tokens";
import { alchemy, getProvider } from "@/web3/network";
import { useAuthStore } from "@/stores/auth";
import { useNetworkStore } from "@/stores/network";
import { BigNumber as EthBigNumber } from 'ethers';
import { useTokenStore } from "@/stores/token";
 
export async function loadErc20Token(token: string, network?: Network) : Promise<Token> {
    const metadata = await alchemy(network).core.getTokenMetadata(token);
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
        logoURI: metadata.logo!,
        chainId: network!.chainId,
    }
}

export function normalizeBalance(balance: EthBigNumber, decimals: number) : NormalizedTokenBalance {
    const normalized = new BigNumber(
        balance.toString()
    ).div(BigNumber(10).pow(decimals));
    if (normalized.gt(1)) {
        return {
            value: balance,
            normalized: normalized.dp(3).toString(10),
            updatedAt: new Date()
        };
    } else {
        return {
            value: balance,
            normalized: normalized.dp(4).toString(10),
            updatedAt: new Date()
        }
    }
}

export async function initTokenList(network: Network) {
    const auth = useAuthStore();
    const tokens = useTokenStore();
    const DEFAULT_TOKENS = await getPopularTokens(network);
    DEFAULT_TOKENS.tokens.forEach(t => tokens.set(t));
    const preferences : Token[] = await getTokenPreferences(auth.user!, network);
    preferences.forEach(p => tokens.set(p));
}

export type BalanceMap = {[key: string] : NormalizedTokenBalance};

export async function getBalances(account: string, balances: BalanceMap = {}) : Promise<BalanceMap> {
    const store = useTokenStore();
    const nativeCoin = useTokenStore().nativeCoin;
    balances[nativeCoin.address] = normalizeBalance(
        await getProvider().getBalance(account),
        nativeCoin.decimals
    );

    const erc20s = store.tokens.map(
        t => t.address
    ).filter(addr => addr != nativeCoin.address);
    const result = await alchemy().core.getTokenBalances(account, erc20s);
    result.tokenBalances.map((b, i) => {
        const decimals = store.token(b.contractAddress).decimals;
        if (b.tokenBalance && !b.error) {
            balances[b.contractAddress] = normalizeBalance(
                EthBigNumber.from(b.tokenBalance), decimals
            );
        }
    });
    return balances;
}

export async function updatePreferences(balances: BalanceMap) {
    const store = useTokenStore();
    const balance = (t: Token) => balances[t.address.toLowerCase()];
    const tokensToSetPreference : PreferenceInput[] = 
        store.tokens.filter(
            t => !t.preference && balance(t)?.value.gt(0)
        ).map(t => ({
            chain: useNetworkStore().network!.name,
            display: true,
            tokenAddress: t.address.toLowerCase(),
            metadata: t
        }));
    const inserted = await insertTokenPreferences(
        useAuthStore().user!, tokensToSetPreference
    );
    inserted.forEach(res => {
        store.setPreference(
            res.metadata,
            {id: res.id, display: res.display}
        );
    });
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
            decimals: Number(transfer.rawContract.decimal) || -1,
            symbol: transfer.asset || "",
            name: "",
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
        alchemy().core.getAssetTransfers({fromAddress: input.wallet, ...params}),
        alchemy().core.getAssetTransfers({toAddress: input.wallet, ...params}),
    ]);
    const transfers = send.transfers.concat(receive.transfers).map(
        t => toAssetTransfer(input.wallet, t)
    );
    transfers.sort((a, b) => a.tx.blockNumber - b.tx.blockNumber).slice(0, 1000);
    return transfers;
}