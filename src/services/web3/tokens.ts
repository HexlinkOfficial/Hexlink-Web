import type { AssetTransfersWithMetadataParams, AssetTransfersWithMetadataResult } from "alchemy-sdk";
import BigNumber from "bignumber.js";
import {
    getTokenPreferences,
    insertTokenPreferences
} from '@/services/graphql/preference';
import type {
    PreferenceInput,
} from "@/services/graphql/preference";
import type {
    TokenMetadata,
    Token,
    NormalizedTokenBalance
} from '@/types';
import { getPopularTokens } from "@/configs/tokens";
import { alchemy, getProvider } from "@/services/web3/network";
import { useProfileStore } from "@/stores/profile";
import { ethers } from "ethers";
import { IERC20_ABI } from "@/configs/contract";
import { useAuthStore } from "@/stores/auth";
import { useNetworkStore } from "@/stores/network";
import { useWalletStore } from "@/stores/wallet";
 
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

function normalizeBalance(balance: BigNumber, decimals: number) : NormalizedTokenBalance {
    const normalized = balance.div(BigNumber(10).pow(decimals));
    if (normalized.gt(1)) {
        return {
            value: balance,
            normalized: normalized.dp(5),
            updatedAt: new Date()
        };
    } else {
        return {
            value: balance,
            normalized,
            updatedAt: new Date()
        }
    }
}

export async function initTokenList() {
    const auth = useAuthStore();
    const network = useNetworkStore().network;
    let tokens : { [key: string]: Token } = {};
    const DEFAULT_TOKENS = await getPopularTokens(network);
    DEFAULT_TOKENS.tokens.forEach(t => tokens[t.address.toLowerCase()] = {metadata: t});
    const preferences : Token[] = await getTokenPreferences(
        auth.user!, network
    );
    preferences.forEach(p => {
        const address = p.metadata.address.toLowerCase();
        tokens[address] = p;
    });
    return tokens;
}

export async function updateProfileBalances() {
    const store = useProfileStore();
    const tokens = Object.values(store.profile?.tokens || []);
    const account = store.profile.account.address;
    await Promise.all(tokens.map(
        token => updateProfileBalance(account, token.metadata, token.balance)
    ));
    await updatePreferences();
}

async function updateProfileBalance(
    account: string,
    metadata: TokenMetadata,
    balance: NormalizedTokenBalance | undefined
) {
    useProfileStore().updateBalance(
        metadata.address,
        await getBalance(account, metadata, balance)
    );
}

export async function updateWalletBalances() {
    const store = useProfileStore();
    const tokens = Object.values(store.profile?.tokens || []);
    await Promise.all(tokens.map(
        token => updateWalletBalance(token.metadata)
    ));
}

async function updateWalletBalance(
    metadata: TokenMetadata
) {
    const wallet = useWalletStore();
    const oldBalance = wallet.balances[metadata.address.toLowerCase()];
    wallet.updateBalance(
        metadata.address,
        await getBalance(wallet.wallet!.account.address, metadata, oldBalance)
    );
}

async function getBalance(
    account: string,
    token: TokenMetadata,
    balance: NormalizedTokenBalance | undefined
) : Promise<NormalizedTokenBalance> {
    const provider = getProvider();
    try {
        let balance = ethers.BigNumber.from(0);
        if (token.address == useNetworkStore().nativeCoinAddress) {
            balance = await provider.getBalance(account);
        } else {
            const contract = new ethers.Contract(token.address, IERC20_ABI, provider);
            balance = await contract.balanceOf(account);
        }
        return normalizeBalance(
            new BigNumber(balance.toHexString()),
            token.decimals
        );
    } catch (error: any) {
        console.log("Failed load balance for token " + JSON.stringify(token));
        console.log(error);
        return balance ? balance : normalizeBalance(new BigNumber(0), token.decimals);
    }
}

async function updatePreferences() {
    const store = useProfileStore();
    const tokensToSetPreference : PreferenceInput[] = 
        Object.values(store.profile?.tokens || []).filter(
            t => !t.preference && t.balance?.value.gt(0)
        ).map(t => ({
            chain: useNetworkStore().network.name,
            display: true,
            tokenAddress: t.metadata.address,
            metadata: t.metadata
        }));
    const inserted = await insertTokenPreferences(
        useAuthStore().user!, tokensToSetPreference
    );
    for (let i = 0; i < tokensToSetPreference.length; i++) {
        const p = tokensToSetPreference[i];
        const preference = {id: inserted[i].id, display: p.display};
        store.updatePreference(p.metadata.address, preference);
    }
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
        balance: normalizeBalance(
            new BigNumber(balance.tokenBalance!),
            token.decimals
        )
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