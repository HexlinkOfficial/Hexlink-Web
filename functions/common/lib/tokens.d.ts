import type { Chain } from "./chain";
import { BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";
export interface Token {
    chain?: string;
    chainId: string | number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
    preference?: TokenPreference;
}
export interface TokenDataList {
    tags?: {
        [key: string]: {
            name: string;
            description: string;
        };
    };
    tokens: Token[];
    timestamp: string;
    error?: string;
}
export interface TokenPreference {
    id: number;
    tokenAlias?: string;
    display: boolean;
}
interface IToken {
    address: string;
    decimals: number;
}
export declare function nativeCoin(chain: Chain): IToken;
export declare function wrappedCoin(chain: Chain): IToken | undefined;
export declare function stableCoins(chain: Chain): IToken[];
export declare function nativeCoinAddress(chain: Chain): string;
export declare function wrappedCoinAddress(chain: Chain): string | undefined;
export declare function stableCoinAddresses(chain: Chain): string[];
export declare function allowedGasToken(chain: Chain): string[];
export declare function getPopularTokens(chain: Chain): Promise<TokenDataList>;
export declare function isNativeCoin(token: string, chain: Chain): boolean;
export declare function isWrappedCoin(token: string, chain: Chain): boolean;
export declare function isStableCoin(token: string, chain: Chain): boolean;
export declare function isAllowedGasToken(token: string, chain: Chain): boolean;
export declare function gasTokenDecimals(token: string, chain: Chain): number | undefined;
export declare function tokenBase(token: Token): BigNumber;
export declare function tokenAmount(balance: string | number, decimals: number): EthBigNumber;
export {};
