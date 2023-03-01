"use strict";
import GOERLI_TOKENS from "./tokens/GOERLI_TOKENS.json";
import MUMBAI_TOKENS from "./tokens/MUMBAI_TOKENS.json";
import POLYGON_TOEKNS from "./tokens/POLYGON_TOKENS.json";
import ARBITRUM_TESTNET_TOKENS from "./tokens/ARBITRUM_TESTNET_TOKENS.json";
import ARBITRUM_NOVA_TOKENS from "./tokens/ARBITRUM_NOVA_TOKENS.json";
import ADDRESSES from "./addresses.json";
import { BigNumber } from "bignumber.js";
import { toEthBigNumber } from "./utils";
export function nativeCoin(chain) {
    return ADDRESSES[chain.name].nativeCoin;
}
export function wrappedCoin(chain) {
    return ADDRESSES[chain.name].wrappedCoin;
}
export function stableCoins(chain) {
    return ADDRESSES[chain.name].stableCoins;
}
export function nativeCoinAddress(chain) {
    return nativeCoin(chain).address.toLowerCase();
}
export function wrappedCoinAddress(chain) {
    return wrappedCoin(chain)?.address.toLowerCase();
}
export function stableCoinAddresses(chain) {
    return stableCoins(chain).map(a => a.address.toLowerCase());
}
export function allowedGasToken(chain) {
    const wrapped = wrappedCoinAddress(chain);
    return [
        nativeCoinAddress(chain),
        ...stableCoinAddresses(chain),
    ].concat(wrapped ? [wrapped] : []);
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
    if (chain.chainId == "421613") {
        return {
            timestamp: new Date().toISOString(),
            tokens: ARBITRUM_TESTNET_TOKENS,
        };
    }
    if (chain.chainId == "42170") {
        return {
            timestamp: new Date().toISOString(),
            tokens: ARBITRUM_NOVA_TOKENS,
        };
    }
    return {
        tokens: [],
        timestamp: new Date().toDateString(),
        error: "Unsupported network " + chain.chainId,
    };
}
function equal(a, b) {
    return a.toLowerCase() == b.toLowerCase();
}
export function isNativeCoin(token, chain) {
    return equal(token, nativeCoinAddress(chain));
}
export function isWrappedCoin(token, chain) {
    const wrapped = wrappedCoinAddress(chain);
    if (!wrapped) {
        return false;
    }
    return equal(token, wrapped);
}
export function isStableCoin(token, chain) {
    return stableCoinAddresses(chain).includes(token.toLowerCase());
}
export function isAllowedGasToken(token, chain) {
    return isNativeCoin(token, chain) ||
        isWrappedCoin(token, chain) ||
        isStableCoin(token, chain);
}
export function gasTokenDecimals(token, chain) {
    if (isNativeCoin(token, chain)) {
        return nativeCoin(chain).decimals;
    }
    if (isWrappedCoin(token, chain)) {
        return wrappedCoin(chain).decimals;
    }
    if (isStableCoin(token, chain)) {
        return stableCoins(chain).find(c => c.address.toLowerCase() === token.toLowerCase())?.decimals;
    }
}
export function tokenBase(token) {
    return new BigNumber(10).pow(token.decimals);
}
export function tokenAmount(balance, decimals) {
    return toEthBigNumber(new BigNumber(10).pow(decimals).times(balance));
}
