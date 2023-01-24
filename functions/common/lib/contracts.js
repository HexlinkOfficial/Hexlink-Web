/* eslint-disable require-jsdoc */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.erc20Contract = exports.erc20Interface = void 0;
const ethers_1 = require("ethers");
const ERC20_ABI_json_1 = __importDefault(require("./abi/ERC20_ABI.json"));
exports.erc20Interface = new ethers_1.ethers.utils.Interface(ERC20_ABI_json_1.default);
function erc20Contract(provider, address) {
    return new ethers_1.ethers.Contract(address, ERC20_ABI_json_1.default, provider);
}
exports.erc20Contract = erc20Contract;
