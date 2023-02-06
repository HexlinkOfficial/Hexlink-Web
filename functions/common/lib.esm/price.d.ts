import { Chain } from "./chain";
import { BigNumber as EthBigNumber } from "ethers";
export interface PriceConfig {
    nativeCurrencyInUsd: string;
    defaultGasPrice: string;
}
export interface PriceInfo extends PriceConfig {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    lastBaseFeePerGas: string;
}
export declare const PriceConfigs: {
    [key: string]: PriceConfig;
};
export declare function gasTokenPricePerGwei(chain: Chain, token: string, decimals: number, price: PriceConfig): string;
export declare function calcGas(chain: Chain, gasToken: {
    address: string;
    decimals: number;
}, amount: EthBigNumber, priceInfo: PriceInfo): EthBigNumber;
