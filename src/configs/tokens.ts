import type { Network, TokenDataList, Token } from "@/types";
import GOERLI_TOKENS from "@/configs/tokens/GOERLI_TOKENS.json";
import MUMBAI_TOKENS from "@/configs/tokens/MUMBAI_TOKENS.json";
import POLYGON_TOEKNS from"@/configs/tokens/POLYGON_TOKENS.json";

const POLYGON_POPULAR_TOKENS = "https://api-polygon-tokens.polygon.technology/tokenlists/popularTokens.tokenlist.json";

export function nativeCoinAddress(network: Network) {
    return network.contracts.nativeCoin;
}

export function wrappedCoinAddress(network: Network) {
    return network.contracts.wrappeCoin;
}

export function isStableCoin(network: Network, token: Token) {
    const address = token.metadata.address.toLowerCase();
    return (
        network.contracts.stableCoins as string[]
    ).map(c => c.toLowerCase()).includes(address);
}

export async function getPopularTokens(network: Network) : Promise<TokenDataList> {
    if (network.chainId == 137) {
        // const response = await fetch(POLYGON_POPULAR_TOKENS);
        // return await response.json();
        return {
            timestamp: new Date().toISOString(),
            tokens: POLYGON_TOEKNS,
        }
    }
    if (network.chainId == 5) {
        return {
            timestamp: new Date().toISOString(),
            tokens: GOERLI_TOKENS,
        }
    }
    if (network.chainId == 80001) {
        return {
            timestamp: new Date().toISOString(),
            tokens: MUMBAI_TOKENS,
        }
    }
    return {
        tokens: [],
        timestamp: new Date().toDateString(),
        error: "Unsupported network " + network.chainId
    };
}

export function isNativeCoin(network: Network, token: Token) {
    const nativeCoin = nativeCoinAddress(network) as string;
    const tokenAddr = token.metadata.address;
    return tokenAddr.toLowerCase() == nativeCoin.toLowerCase();
}

export function isWrappedCoin(network: Network, token: Token) {
    const wrappeCoin = wrappedCoinAddress(network) as string;
    const tokenAddr = token.metadata.address;
    return tokenAddr.toLowerCase() == wrappeCoin.toLowerCase();
}