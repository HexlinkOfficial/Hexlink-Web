import type { AssetTransfersWithMetadataParams, AssetTransfersWithMetadataResult } from "alchemy-sdk";
import BigNumber from "bignumber.js";
import { useChainStore } from "@/stores/chain";
import { useTokenStore } from "@/stores/token";
import type { Token, Chain, NormalizedTokenBalance } from "../../../../functions/common";
import { normalizeBalance, getPopularTokens } from "../../../../functions/common";
import { Alchemy, Network } from "alchemy-sdk";
import { alchemyKey } from "@/web3/network";

function alchemyNetwork(chain: Chain) : Network {
    if (chain.chainId == "5") {
        return Network.ETH_GOERLI;
    }
    if (chain.chainId == "137") {
        return Network.MATIC_MAINNET;
    }
    if (chain.chainId == "80001") {
        return Network.MATIC_MUMBAI;
    }
    if (chain.chainId == "421613") {
        return Network.ARB_GOERLI;
    }
    if (chain.chainId == "42161") {
        return Network.ARB_MAINNET;
    }
    throw new Error("Unsupported network");
}

function alchemy() {
    const chain = useChainStore().chain;
    return new Alchemy({
        apiKey: alchemyKey(chain),
        network: alchemyNetwork(chain!)
    });
}

export async function loadAndSetErc20Token(token: string) : Promise<Token> {
    const tokenStore = useTokenStore();
    if (!tokenStore.token(token)) {
        tokenStore.set(await loadErc20Token(token));
    }
    return tokenStore.token(token);
}

export async function loadErc20Token(token: string) : Promise<Token> {
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
        logoURI: metadata.logo!,
        chain: useChainStore().chain.name,
        chainId: useChainStore().chain.chainId!,
    }
}

export async function initTokenList(chain: Chain) {
    const tokens = useTokenStore();
    const DEFAULT_TOKENS = await getPopularTokens(chain);
    DEFAULT_TOKENS.tokens.forEach(t => tokens.set(t));
}

export type BalanceMap = {[key: string] : NormalizedTokenBalance};

export async function getBalances(account: string, balances: BalanceMap = {}) : Promise<BalanceMap> {
    const store = useTokenStore();
    const nativeCoin = useTokenStore().nativeCoin;
    const balance = await useChainStore().provider.getBalance(account);
    balances[nativeCoin.address] = normalizeBalance(
        balance.toString(),
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
                b.tokenBalance, decimals
            );
        }
    });
    return balances;
}

export interface Transaction {
    hash: string;
    blockNumber: number;
    timestamp?: string;
    position?: number;
    tokenID?: string
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
    if (transfer.from.toLowerCase() == wallet.toLowerCase()) {
        return {
            type: "send",
            to: transfer.to,
        } as Action;
    } else if (transfer.to?.toLowerCase() == wallet.toLowerCase()) {
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
            tokenID: parseInt(transfer.erc721TokenId || "", 16).toString() || "",
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
    let params = { category, order, withMetadata: true, maxCount: 50,} as AssetTransfersWithMetadataParams;
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
    transfers.sort((a, b) => a.tx.blockNumber - b.tx.blockNumber).slice(0, 50);
    return transfers;
}

export function loadTokenLogo(address: string): string {
    if (address === "") {
        return useTokenStore().nativeCoin!.logoURI!;
    }
    return useTokenStore().token(address).logoURI || "";
}