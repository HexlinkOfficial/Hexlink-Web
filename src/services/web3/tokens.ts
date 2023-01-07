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
import type { TokenBalance } from "alchemy-sdk";
import { TokenBalanceType } from "alchemy-sdk";
import type { TokenBalancesOptionsErc20 } from "alchemy-sdk";
import { useAuthStore } from "@/stores/auth";
import { getPopularTokens, nativeCoinAddress } from "@/configs/tokens";
import { alchemy } from "@/services/web3/network";
import { useProfileStore } from "@/stores/profile";

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

async function getNativeCoinBalance(wallet: string, network: Network): Promise<TokenBalance> {
    const result = await alchemy().core.getBalance(wallet);
    return {
        contractAddress: nativeCoinAddress(network),
        tokenBalance: result.toHexString(),
        error: null,
    };
}

function getBalance(balance: BigNumber, decimals: number) : NormalizedTokenBalance {
    const normalized = balance.div(BigNumber(10).pow(decimals));
    if (normalized.gt(1)) {
        return {
            value: balance,
            normalized: normalized.dp(5)
        };
    } else {
        return {
            value: balance,
            normalized
        }
    }
}

export async function loadTokens(account: string) {
    const profiles = useProfileStore();
    const auth = useAuthStore();
    const network = profiles.network;
    let tokens : { [key: string]: Token } = {};

    // generate token map
    if (!profiles.profile.tokenInitiated) {
        const DEFAULT_TOKENS = await getPopularTokens(network);
        DEFAULT_TOKENS.tokens.forEach(t => tokens[t.address.toLowerCase()] = {metadata: t});
        const preferences : Token[] = await getTokenPreferences(
            auth.user!, network
        );
        preferences.forEach(p => {
            const address = p.metadata.address.toLowerCase();
            if (p.preference!.display == false && address in tokens) {
                delete tokens[address];
            } else if (p.preference!.display == true) {
                tokens[address] = p;
            }
        });
    } else {
        tokens = useProfileStore().profile.tokens;
    }

    // collect balance information
    const tokensToSetPreference : PreferenceInput[] = [];
    const ethBalance = await getNativeCoinBalance(account, network);
    const option: TokenBalancesOptionsErc20 = {type : TokenBalanceType.ERC20};
    const erc20Balances = await alchemy().core.getTokenBalances(account, option);
    const balances = erc20Balances.tokenBalances.concat([ethBalance as TokenBalance]);
    balances.forEach(b => {
        const address = b.contractAddress.toLowerCase();
        if (b && !b.error && b.tokenBalance) {
            const balance = new BigNumber(b.tokenBalance);
            if (balance.gt(0) && address in tokens) {
                tokens[address].balance = getBalance(
                    balance,
                    tokens[address].metadata.decimals
                );
                if (!tokens[address].preference) {
                    tokensToSetPreference.push({
                        chain: network.name,
                        display: true,
                        tokenAddress: address,
                        metadata: tokens[address].metadata
                    });
                }
            }
        } else {
            tokens[address].balance = {
                value: new BigNumber(0),
                normalized: new BigNumber(0),
                error: b.error || "error when getting balance"
            };
        }
    });

    // update preference
    const inserted = await insertTokenPreferences(auth.user!, tokensToSetPreference);
    for (let i = 0; i < tokensToSetPreference.length; i++) {
        const p = tokensToSetPreference[i];
        const preference = {id: inserted[i].id, display: p.display};
        tokens[p.tokenAddress].preference = preference;
    }
    return tokens;
}

export async function loadERC20Token(
    address: string,
    wallet: string
): Promise<Token> {
    const token = await getERC20Metadata(address);
    const balances = await alchemy().core.getTokenBalances(wallet, [address]);
    const [balance] = balances.tokenBalances;
    const transformed = new BigNumber(balance.tokenBalance!);
    return {
        metadata: token,
        balance: getBalance(transformed, token.decimals)
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