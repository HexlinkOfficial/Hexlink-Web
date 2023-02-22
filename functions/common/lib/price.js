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
exports.calcGas = void 0;
const tokens_1 = require("./tokens");
const ethers_1 = require("ethers");
function calcGas(chain, gasToken, amount, price) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, tokens_1.isNativeCoin)(gasToken.address, chain) || (0, tokens_1.isWrappedCoin)(gasToken.address, chain)) {
            return amount.mul(price.gasPrice);
        }
        else if ((0, tokens_1.isStableCoin)(gasToken.address, chain)) {
            const base = ethers_1.BigNumber.from(10).pow(18);
            return amount.mul(price.gasPrice).mul(price.tokenPrice).div(base).add(1);
        }
        throw new Error("Unsupported gas token");
    });
}
exports.calcGas = calcGas;
