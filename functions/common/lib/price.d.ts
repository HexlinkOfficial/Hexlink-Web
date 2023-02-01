export interface PriceConfig {
    nativeCurrencyInUsd: string;
    gasPrice: string;
    updatedAt?: Date;
}
export declare const PriceConfigs: {
    [key: string]: PriceConfig;
};
