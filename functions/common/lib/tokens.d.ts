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
export declare function nativeCoinAddress(chain: Chain): string;
export declare function wrappedCoinAddress(chain: Chain): string;
export declare function stableCoinAddresses(chain: Chain): string[];
export declare function allowedGasToken(chain: Chain): string[];
export declare function getPopularTokens(chain: Chain): Promise<TokenDataList>;
export declare function isNativeCoin(token: string, chain: Chain): boolean;
export declare function isWrappedCoin(token: string, chain: Chain): boolean;
export declare function isStableCoin(token: string, chain: Chain): boolean;
export declare function tokenBase(token: Token): BigNumber;
export declare function tokenAmount(balance: string | number, decimals: number): EthBigNumber;
