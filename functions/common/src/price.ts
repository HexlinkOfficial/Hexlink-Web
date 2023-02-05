export interface PriceConfig {
    nativeCurrencyInUsd: string,
    gasPrice: string,
    updatedAt?: Date,
}

const GOERLI : PriceConfig = {
    nativeCurrencyInUsd: "1500.0",
    gasPrice: "10000000000", // 10 gwei
};

const POLYGON : PriceConfig = {
    nativeCurrencyInUsd: "1.0",
    gasPrice: "100000000000", // 100 gwei
};

const MUMBAI : PriceConfig = {
    nativeCurrencyInUsd: "1.0",
    gasPrice: "2000000000", // 2 gwei
};

export const PriceConfigs : {[key: string]: PriceConfig} = {
    "goerli": GOERLI,
    "polygon": POLYGON,
    "mumbai": MUMBAI,
};