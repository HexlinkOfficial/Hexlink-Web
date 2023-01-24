"use strict";
import { ethers } from "ethers";
import { BigNumber } from "bignumber.js";
export function hash(value) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(value));
}
export function prettyPrintAddress(address, start, stop) {
    const len = address.length;
    return address.substring(0, start) +
        "..." + address.substring(len - stop, len);
}
export function prettyPrintTxHash(txHash) {
    if (txHash) {
        const len = txHash.length;
        return txHash.substring(0, 6) + "..." + txHash.substring(len - 6, len);
    }
    return "N/A";
}
export function prettyPrintTimestamp(ts) {
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
export function truncateAddress(address) {
    const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/);
    if (!match)
        return address;
    return `${match[1]}…${match[2]}`;
}
export function toHex(num) {
    const val = Number(num);
    return "0x" + val.toString(16);
}
export function normalizeBalance(balance, decimals) {
    const normalized = new BigNumber(balance).div(new BigNumber(10).pow(decimals));
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
export async function isContract(provider, address) {
    try {
        const code = await provider.getCode(address);
        if (code !== "0x")
            return true;
        // eslint-disable-next-line no-empty
    }
    catch (error) { }
    return false;
}
