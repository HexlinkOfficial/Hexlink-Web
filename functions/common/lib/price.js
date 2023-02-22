"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcGas = void 0;
const tokens_1 = require("./tokens");
const ethers_1 = require("ethers");
function calcGas(chain, gasToken, amount, price) {
    if ((0, tokens_1.isNativeCoin)(gasToken.address, chain) || (0, tokens_1.isWrappedCoin)(gasToken.address, chain)) {
        return amount.mul(price.gasPrice);
    }
    else if ((0, tokens_1.isStableCoin)(gasToken.address, chain)) {
        const base = ethers_1.BigNumber.from(10).pow(gasToken.decimals);
        return amount.mul(price.gasPrice).mul(price.tokenPrice).div(base).add(1);
    }
    throw new Error("Unsupported gas token");
}
exports.calcGas = calcGas;
