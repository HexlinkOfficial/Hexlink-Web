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
    Network,
    NormalizedTokenBalance
} from '@/types';
import { getPopularTokens } from "@/configs/tokens";
import { alchemy, getProvider } from "@/services/web3/network";
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { useNetworkStore } from "@/stores/network";
import { useWalletStore } from "@/stores/wallet";
import { BigNumber as EthBigNumber } from 'ethers';
 
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

export function normalizeBalance(balance: EthBigNumber, decimals: number) : NormalizedTokenBalance {
    const normalized = new BigNumber(
        balance.toString()
    ).div(BigNumber(10).pow(decimals));
    if (normalized.gt(1)) {
        return {
            value: balance,
            normalized: normalized.dp(5).toString(10),
            updatedAt: new Date()
        };
    } else {
        return {
            value: balance,
            normalized: normalized.toString(10),
            updatedAt: new Date()
        }
    }
}

export async function initTokenList(network: Network) {
    const auth = useAuthStore();
    let tokens : { [key: string]: Token } = {};
    const DEFAULT_TOKENS = await getPopularTokens(network);
    DEFAULT_TOKENS.tokens.forEach(t => tokens[t.address.toLowerCase()] = {metadata: t});
    const preferences : Token[] = await getTokenPreferences(auth.user!, network);
    preferences.forEach(p => {
        const address = p.metadata.address.toLowerCase();
        tokens[address] = {
            metadata: p.metadata,
            preference: p.preference
        };
    });
    return tokens;
}

export async function updateProfileBalances() {
    const store = useProfileStore();
    const account = store.profile?.account.address;
    await updateBalances(
        account,
        (address) => store.balance(address),
        (address, balance) => store.updateBalance(address, balance)
    );
    await updatePreferences();
}

export async function updateWalletBalances() {
    const wallet = useWalletStore();
    if (!wallet.connected) { return; }
    const account = wallet.wallet!.account.address;
    await updateBalances(
        account,
        (address: string) => wallet.balance(address.toLowerCase()),
        (
            address: string,
            balance: NormalizedTokenBalance
        ) => wallet.updateBalance(address.toLowerCase(), balance)
    );
}

async function updateBalances(
    account: string,
    getPrevBalance: (tokenAddr: string) => NormalizedTokenBalance | undefined,
    update: (tokenAddr: string, balance: NormalizedTokenBalance) => void,
) : Promise<void> {
    const profile = useProfileStore().profile;
    const tokens = Object.values(profile.tokens || []);
    const nativeCoin = useNetworkStore().nativeCoinAddress;
    const decimals = profile.tokens[nativeCoin].metadata.decimals;
    let balance = getPrevBalance(nativeCoin) || normalizeBalance(EthBigNumber.from(0), decimals);
    try {
        const nativeCoinBalance = await getProvider().getBalance(account);
        balance = normalizeBalance(
            nativeCoinBalance,
            decimals
        );
    } catch(error) {
        console.log(error);
    };
    update(nativeCoin, balance);

    const erc20s = tokens.map(
        t => t.metadata.address
    ).filter(addr => addr != nativeCoin);
    const result = await alchemy().core.getTokenBalances(account, erc20s);
    result.tokenBalances.map((b, i) => {
        const decimals = profile.tokens[
            b.contractAddress.toLowerCase()
        ].metadata.decimals;
        let balance = getPrevBalance(
            b.contractAddress
        ) || normalizeBalance(EthBigNumber.from(0), decimals);
        if (b.tokenBalance && !b.error) {
            balance = normalizeBalance(EthBigNumber.from(b.tokenBalance), decimals);
        }
        update(b.contractAddress, balance);
    });
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
            EthBigNumber.from(balance.tokenBalance!),
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