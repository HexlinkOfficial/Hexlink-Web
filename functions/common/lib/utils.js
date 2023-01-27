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
exports.toEthBigNumber = exports.isContract = exports.normalizeBalance = exports.toHex = exports.truncateAddress = exports.prettyPrintTimestamp = exports.prettyPrintTxHash = exports.prettyPrintAddress = exports.hash = void 0;
const ethers_1 = require("ethers");
const bignumber_js_1 = require("bignumber.js");
function hash(value) {
    return ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.toUtf8Bytes(value));
}
exports.hash = hash;
function prettyPrintAddress(address, start, stop) {
    const len = address.length;
    return address.substring(0, start) +
        "..." + address.substring(len - stop, len);
}
exports.prettyPrintAddress = prettyPrintAddress;
function prettyPrintTxHash(txHash) {
    if (txHash) {
        const len = txHash.length;
        return txHash.substring(0, 6) + "..." + txHash.substring(len - 6, len);
    }
    return "N/A";
}
exports.prettyPrintTxHash = prettyPrintTxHash;
function prettyPrintTimestamp(ts) {
    const now = new Date().valueOf();
    const epoch = new Date(ts).valueOf();
    const diff = now - epoch;
    if (diff < 60) {
        return now - epoch + " seconds ago";
    }
    else if (diff < 3600) {
        return Math.floor(diff / 60) + " minutes ago";
    }
    else if (diff < 3600 * 24) {
        return Math.floor(diff / 3600) + " hours ago";
    }
    else {
        return new Date(ts).toLocaleString();
    }
}
exports.prettyPrintTimestamp = prettyPrintTimestamp;
function truncateAddress(address) {
    const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/);
    if (!match)
        return address;
    return `${match[1]}…${match[2]}`;
}
exports.truncateAddress = truncateAddress;
function toHex(num) {
    const val = Number(num);
    return "0x" + val.toString(16);
}
exports.toHex = toHex;
function normalizeBalance(balance, decimals) {
    const normalized = new bignumber_js_1.BigNumber(balance).div(new bignumber_js_1.BigNumber(10).pow(decimals));
    if (normalized.gt(1)) {
        return {
            value: balance,
            normalized: normalized.dp(3).toString(10),
            updatedAt: new Date(),
        };
    }
    else {
        return {
            value: balance,
            normalized: normalized.dp(4).toString(10),
            updatedAt: new Date(),
        };
    }
}
exports.normalizeBalance = normalizeBalance;
function isContract(provider, address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const code = yield provider.getCode(address);
            if (code !== "0x")
                return true;
            // eslint-disable-next-line no-empty
        }
        catch (error) { }
        return false;
    });
}
exports.isContract = isContract;
function toEthBigNumber(value) {
    if (value instanceof bignumber_js_1.BigNumber) {
        return ethers_1.BigNumber.from(value.toString(10));
    }
    return ethers_1.BigNumber.from(value);
}
exports.toEthBigNumber = toEthBigNumber;
