import { BigNumber } from "bignumber.js";
import { isNativeCoin, isStableCoin, isWrappedCoin } from "./tokens";
import { BigNumber as EthBigNumber } from "ethers";
import { toEthBigNumber } from "./utils";
const GOERLI = {
    nativeCurrencyInUsd: "1500.0",
    defaultGasPrice: "10000000000", // 10 gwei
};
const POLYGON = {
    nativeCurrencyInUsd: "1.0",
    defaultGasPrice: "100000000000", // 100 gwei
};
const MUMBAI = {
    nativeCurrencyInUsd: "1.0",
    defaultGasPrice: "2000000000", // 2 gwei
};
export const PriceConfigs = {
    "goerli": GOERLI,
    "polygon": POLYGON,
    "mumbai": MUMBAI,
};
export function gasTokenPricePerGwei(chain, token, price) {
    if (isNativeCoin(token, chain) || isWrappedCoin(token, chain)) {
        return "1000000000"; // 1Gwei = 10^9 wei
    }
    if (isStableCoin(token, chain)) {
        const oneEth = BigNumber(10).pow(18).times(price.nativeCurrencyInUsd);
        return oneEth.div("1000000000").toString(10);
    }
    throw new Error("Not supported gas token");
}
;
function getGasPrice(price, prepay) {
    let gasPrice = EthBigNumber.from(price.lastBaseFeePerGas).add(price.maxPriorityFeePerGas);
    gasPrice = gasPrice.gt(price.maxFeePerGas)
        ? EthBigNumber.from(price.maxFeePerGas)
        : gasPrice;
    return prepay && gasPrice.lt(price.defaultGasPrice)
        ? price.defaultGasPrice
        : gasPrice;
}
export function calcGas(chain, gasToken, amount, priceInfo, prepay) {
    const gasPrice = getGasPrice(priceInfo, prepay);
    if (isNativeCoin(gasToken.address, chain) || isWrappedCoin(gasToken.address, chain)) {
        return amount.mul(gasPrice);
    }
    else if (isStableCoin(gasToken.address, chain)) {
        // calculate usd value of tokens
        const normalizedUsd = new BigNumber(10).pow(gasToken.decimals).times(priceInfo.nativeCurrencyInUsd);
        const nativeCoinBase = EthBigNumber.from(10).pow(chain.nativeCurrency.decimals);
        return toEthBigNumber(normalizedUsd).mul(amount).mul(gasPrice).div(nativeCoinBase);
    }
    throw new Error("Unsupported gas token");
}
export async function genPriceInfo(provider, priceConfig) {
    const feeData = await provider.getFeeData();
    return {
        ...priceConfig,
        lastBaseFeePerGas: feeData.lastBaseFeePerGas?.toString() || "0",
        maxFeePerGas: feeData.maxFeePerGas?.toString() || "0",
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString() || "0",
        updatedAt: new Date().getTime()
    };
}
