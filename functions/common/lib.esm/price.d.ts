import { Chain } from "./chain";
export interface PriceConfig {
    nativeCurrencyInUsd: string;
    gasPrice: string;
}
export declare const PriceConfigs: {
    [key: string]: PriceConfig;
};
export declare function gasTokenPricePerGwei(chain: Chain, token: string, decimals: number, price: PriceConfig): string;
