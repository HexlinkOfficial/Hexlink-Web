import { BigNumber } from "bignumber.js";
import { isNativeCoin, isStableCoin, isWrappedCoin } from "./tokens";
import { BigNumber as EthBigNumber } from "ethers";
const GOERLI = {
    nativeCurrencyInUsd: "1500.0",
    gasPrice: "10000000000", // 10 gwei
};
const POLYGON = {
    nativeCurrencyInUsd: "1.0",
    gasPrice: "100000000000", // 100 gwei
};
const MUMBAI = {
    nativeCurrencyInUsd: "1.0",
    gasPrice: "2000000000", // 2 gwei
};
export const PriceConfigs = {
    "goerli": GOERLI,
    "polygon": POLYGON,
    "mumbai": MUMBAI,
};
export function gasTokenPricePerGwei(chain, token, decimals, price) {
    if (isNativeCoin(token, chain) || isWrappedCoin(token, chain)) {
        return "1000000000"; // 1Gwei = 10^9 wei
    }
    if (isStableCoin(token, chain)) {
        const oneEth = BigNumber(10).pow(decimals).times(price.nativeCurrencyInUsd);
        const oneGwei = EthBigNumber.from(oneEth.div(1000000000).toString(10));
        return oneGwei.toString();
    }
    throw new Error("Not supported gas token");
}
;
