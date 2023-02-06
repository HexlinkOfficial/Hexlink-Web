"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genPriceInfo = exports.calcGas = exports.gasTokenPricePerGwei = exports.PriceConfigs = void 0;
const bignumber_js_1 = require("bignumber.js");
const tokens_1 = require("./tokens");
const ethers_1 = require("ethers");
const utils_1 = require("./utils");
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
function getGasPrice(price) {
    let gasPrice = ethers_1.BigNumber.from(price.lastBaseFeePerGas).add(price.maxPriorityFeePerGas);
    gasPrice = gasPrice.gt(price.maxFeePerGas)
        ? ethers_1.BigNumber.from(price.maxFeePerGas)
        : gasPrice;
    return gasPrice.gt(price.defaultGasPrice)
        ? gasPrice
        : price.defaultGasPrice;
}
function calcGas(chain, gasToken, amount, priceInfo) {
    const gasPrice = getGasPrice(priceInfo);
    if ((0, tokens_1.isNativeCoin)(gasToken.address, chain) || (0, tokens_1.isWrappedCoin)(gasToken.address, chain)) {
        return amount.mul(gasPrice);
    }
    else if ((0, tokens_1.isStableCoin)(gasToken.address, chain)) {
        // calculate usd value of tokens
        const normalizedUsd = new bignumber_js_1.BigNumber(10).pow(gasToken.decimals).times(priceInfo.nativeCurrencyInUsd);
        const nativeCoinBase = ethers_1.BigNumber.from(10).pow(chain.nativeCurrency.decimals);
        return (0, utils_1.toEthBigNumber)(normalizedUsd).mul(amount).mul(gasPrice).div(nativeCoinBase);
    }
    throw new Error("Unsupported gas token");
}
exports.calcGas = calcGas;
function genPriceInfo(provider, priceConfig) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const feeData = yield provider.getFeeData();
        return Object.assign(Object.assign({}, priceConfig), { lastBaseFeePerGas: ((_a = feeData.lastBaseFeePerGas) === null || _a === void 0 ? void 0 : _a.toString()) || "0", maxFeePerGas: ((_b = feeData.maxFeePerGas) === null || _b === void 0 ? void 0 : _b.toString()) || "0", maxPriorityFeePerGas: ((_c = feeData.maxPriorityFeePerGas) === null || _c === void 0 ? void 0 : _c.toString()) || "0", updatedAt: new Date().getTime() });
    });
}
exports.genPriceInfo = genPriceInfo;
