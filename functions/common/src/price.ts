
export interface PriceInfo {
    nativeCurrencyInUsd: string,
    gasPrice: string,
}

const GOERLI : PriceInfo = {
    nativeCurrencyInUsd: "1500.0",
    gasPrice: "10000000000", // 10 gwei
};

const POLYGON : PriceInfo = {
    nativeCurrencyInUsd: "1.0",
    gasPrice: "100000000000", // 100 gwei
};

const MUMBAI : PriceInfo = {
    nativeCurrencyInUsd: "1.0",
    gasPrice: "2000000000", // 2 gwei
};

export const PriceConfig : {[key: string]: PriceInfo} = {
    "goerli": GOERLI,
    "polygon": POLYGON,
    "mumbai": MUMBAI,
};