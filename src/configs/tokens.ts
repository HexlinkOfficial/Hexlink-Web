import type { Network, TokenDataList, Token } from "@/types";
import GOERLI_TOKENS from "@/configs/tokens/GOERLI_TOKENS.json";
import MUMBAI_TOKENS from "@/configs/tokens/MUMBAI_TOKENS.json";
import POLYGON_TOEKNS from"@/configs/tokens/POLYGON_TOKENS.json";
import { useNetworkStore } from "@/stores/network";

const POLYGON_POPULAR_TOKENS = "https://api-polygon-tokens.polygon.technology/tokenlists/popularTokens.tokenlist.json";

export function nativeCoinAddress(network: Network) : string {
    return network.address.nativeCoin as string;
}

export function wrappedCoinAddress(network: Network) : string {
    return network.address.wrappedCoin as string;
}

export function stableCoinAddresses(network: Network) : string[] {
    return network.address.stableCoins as string[]
}

export function allowedGasToken(network: Network) : string[] {
    return [
        nativeCoinAddress(network),
        wrappedCoinAddress(network),
        ...stableCoinAddresses(network)
    ];
}

export async function getPopularTokens(network?: Network) : Promise<TokenDataList> {
    network = network || useNetworkStore().network;
    if (network!.chainId == "137") {
        // const response = await fetch(POLYGON_POPULAR_TOKENS);
        // return await response.json();
        return {
            timestamp: new Date().toISOString(),
            tokens: POLYGON_TOEKNS,
        }
    }
    if (network!.chainId == "5") {
        return {
            timestamp: new Date().toISOString(),
            tokens: GOERLI_TOKENS,
        }
    }
    if (network!.chainId == "80001") {
        return {
            timestamp: new Date().toISOString(),
            tokens: MUMBAI_TOKENS,
        }
    }
    return {
        tokens: [],
        timestamp: new Date().toDateString(),
        error: "Unsupported network " + network!.chainId
    };
}

export function isNativeCoin(token: Token, network?: Network) {
    network = network || useNetworkStore().network;
    const nativeCoin = nativeCoinAddress(network!) as string;
    const tokenAddr = token.metadata.address;
    return tokenAddr.toLowerCase() == nativeCoin.toLowerCase();
}

export function isWrappedCoin(token: Token, network?: Network) {
    network = network || useNetworkStore().network;
    const wrappeCoin = wrappedCoinAddress(network!) as string;
    const tokenAddr = token.metadata.address;
    return tokenAddr.toLowerCase() == wrappeCoin?.toLowerCase();
}

export function isStableCoin(token: Token, network?: Network) {
    network = network || useNetworkStore().network;
    const address = token.metadata.address.toLowerCase();
    return stableCoinAddresses(network!).map(
        c => c.toLowerCase()
    ).includes(address);
}