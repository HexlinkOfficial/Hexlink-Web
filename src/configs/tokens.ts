import type { Network, TokenDataList } from "@/types";
import GOERLI_TOKENS from "@/configs/GOERLI_TOKENS.json"

const POLYGON_POPULAR_TOKENS = "https://api-polygon-tokens.polygon.technology/tokenlists/popularTokens.tokenlist.json";

export function nativeCoinAddress(network: Network) {
    if (network.chainId == 137) {
        return "0x0000000000000000000000000000000000001010";
    }
    return "0x0000000000000000000000000000000000000000";
}

export async function getPopularTokens(network: Network) : Promise<TokenDataList> {
    if (network.chainId == 137) {
        const response = await fetch(POLYGON_POPULAR_TOKENS);
        return await response.json();
    }
    if (network.chainId == 5) {
        return {
            timestamp: new Date().toISOString(),
            tokens: GOERLI_TOKENS,
        }
    }
    return {
        tokens: [],
        timestamp: new Date().toDateString(),
        error: "Unsupported network " + network.chainId
    };
}