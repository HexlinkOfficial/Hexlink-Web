"use strict";

import type { Chain } from "./chain";
import GOERLI_TOKENS from "./tokens/GOERLI_TOKENS.json";
import MUMBAI_TOKENS from "./tokens/MUMBAI_TOKENS.json";
import POLYGON_TOEKNS from "./tokens/POLYGON_TOKENS.json";
import ADDRESSES from "./addresses.json";

export interface Token {
    chain?: string,
    chainId: string | number,
    address: string,
    name: string,
    symbol: string,
    decimals: number,
    logoURI?: string,
    preference?: TokenPreference
}

export interface TokenDataList {
    tags?: {[key: string]: {name: string, description: string}}
    tokens: Token[],
    timestamp: string,
    error?: string,
}

export interface TokenPreference {
    id: number;
    tokenAlias?: string;
    display: boolean;
}

export function nativeCoinAddress(chain: Chain) : string {
    return ((ADDRESSES as any)[chain.name].nativeCoin as string).toLowerCase();
}

export function wrappedCoinAddress(chain: Chain) : string {
    return ((ADDRESSES as any)[chain.name].wrappedCoin as string).toLowerCase();
}

export function stableCoinAddresses(chain: Chain) : string[] {
    return ((ADDRESSES as any)[chain.name].stableCoins as string[]).map(a => a.toLowerCase());
}

export function allowedGasToken(chain: Chain) : string[] {
    return [
        nativeCoinAddress(chain),
        wrappedCoinAddress(chain),
        ...stableCoinAddresses(chain)
    ];
}

// const POLYGON_POPULAR_TOKENS = "https://api-polygon-tokens.polygon.technology/tokenlists/popularTokens.tokenlist.json";
export async function getPopularTokens(chain: Chain) : Promise<TokenDataList> {
    if (chain.chainId == "137") {
        // const response = await fetch(POLYGON_POPULAR_TOKENS);
        // return await response.json();
        return {
            timestamp: new Date().toISOString(),
            tokens: POLYGON_TOEKNS,
        }
    }
    if (chain.chainId == "5") {
        return {
            timestamp: new Date().toISOString(),
            tokens: GOERLI_TOKENS,
        }
    }
    if (chain.chainId == "80001") {
        return {
            timestamp: new Date().toISOString(),
            tokens: MUMBAI_TOKENS,
        }
    }
    return {
        tokens: [],
        timestamp: new Date().toDateString(),
        error: "Unsupported network " + chain!.chainId
    };
}

export function isNativeCoin(token: Token, chain: Chain) {
    return token.address == nativeCoinAddress(chain);
}

export function isWrappedCoin(token: Token, chain: Chain) {
    return token.address == wrappedCoinAddress(chain);
}

export function isStableCoin(token: Token, chain: Chain) {
    return stableCoinAddresses(chain).includes(token.address);
}