"use strict";
import GOERLI_TOKENS from "./tokens/GOERLI_TOKENS.json";
import MUMBAI_TOKENS from "./tokens/MUMBAI_TOKENS.json";
import POLYGON_TOEKNS from "./tokens/POLYGON_TOKENS.json";
import ADDRESSES from "./addresses.json";
export function nativeCoinAddress(chain) {
    return ADDRESSES[chain.name].nativeCoin.toLowerCase();
}
export function wrappedCoinAddress(chain) {
    return ADDRESSES[chain.name].wrappedCoin.toLowerCase();
}
export function stableCoinAddresses(chain) {
    return ADDRESSES[chain.name].stableCoins.map((a) => a.toLowerCase());
}
export function allowedGasToken(chain) {
    return [
        nativeCoinAddress(chain),
        wrappedCoinAddress(chain),
        ...stableCoinAddresses(chain),
    ];
}
// const POLYGON_POPULAR_TOKENS = "https://api-polygon-tokens.polygon.technology/tokenlists/popularTokens.tokenlist.json";
export async function getPopularTokens(chain) {
    if (chain.chainId == "137") {
        // const response = await fetch(POLYGON_POPULAR_TOKENS);
        // return await response.json();
        return {
            timestamp: new Date().toISOString(),
            tokens: POLYGON_TOEKNS,
        };
    }
    if (chain.chainId == "5") {
        return {
            timestamp: new Date().toISOString(),
            tokens: GOERLI_TOKENS,
        };
    }
    if (chain.chainId == "80001") {
        return {
            timestamp: new Date().toISOString(),
            tokens: MUMBAI_TOKENS,
        };
    }
    return {
        tokens: [],
        timestamp: new Date().toDateString(),
        error: "Unsupported network " + chain.chainId,
    };
}
export function isNativeCoin(token, chain) {
    return token.address == nativeCoinAddress(chain);
}
export function isWrappedCoin(token, chain) {
    return token.address == wrappedCoinAddress(chain);
}
export function isStableCoin(token, chain) {
    return stableCoinAddresses(chain).includes(token.address);
}
