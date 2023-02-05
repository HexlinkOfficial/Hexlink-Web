"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gasTokenPricePerGwei = exports.PriceConfigs = void 0;
const bignumber_js_1 = require("bignumber.js");
const tokens_1 = require("./tokens");
const ethers_1 = require("ethers");
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
exports.PriceConfigs = {
    "goerli": GOERLI,
    "polygon": POLYGON,
    "mumbai": MUMBAI,
};
function gasTokenPricePerGwei(chain, token, decimals, price) {
    if ((0, tokens_1.isNativeCoin)(token, chain) || (0, tokens_1.isWrappedCoin)(token, chain)) {
        return "1000000000"; // 1Gwei = 10^9 wei
    }
    if ((0, tokens_1.isStableCoin)(token, chain)) {
        const oneEth = (0, bignumber_js_1.BigNumber)(10).pow(decimals).times(price.nativeCurrencyInUsd);
        const oneGwei = ethers_1.BigNumber.from(oneEth.div(1000000000).toString(10));
        return oneGwei.toString();
    }
    throw new Error("Not supported gas token");
}
exports.gasTokenPricePerGwei = gasTokenPricePerGwei;
;
