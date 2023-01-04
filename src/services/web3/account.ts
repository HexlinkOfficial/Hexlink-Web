import * as ethers from "ethers";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getProvider } from "./provider";
import * as config from "@/services/config";

const functions = getFunctions();

export interface Transaction {
    hash: string,
    from: string,
    to: string,
    amount: number,
    state: "Executing" | "Success" | "Error",
}

const genNameHash = function(prefix: string, name: string) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${prefix}:${name}`));
};

export async function accountAddress(prefix: string, name: string | null | undefined) {
    if (!name) return "";
    const admin = new ethers.Contract(
        config.ADMIN,
        config.ADMIN_ABI,
        getProvider()
    );
    console.log(prefix, name);
    console.log(genNameHash(prefix, name));
    return await admin.addressOfName(genNameHash(prefix, name));
};

export async function getBalance(email: string | null | undefined) : Promise<number> {
    const getBalance = httpsCallable(functions, 'getBalance');
    const {data} = await getBalance();
    const {balance} = data as {balance: number};
    return balance;
}

export async function isContract(address: string | undefined | null): Promise<boolean> {
    if (!address || !ethers.utils.isAddress(address)) {
        return false;
    }
    try {
        const code = await getProvider().getCode(address);
        if (code !== '0x') return true;
    } catch (error) { }
    return false;
}

export function prettyPrintAddress(address: string, start: number, stop: number) {
    if (address) {
        const len = address.length;
        return address.substring(0, start) + "..." + address.substring(len - stop, len)
    }
    return "N/A";
}

export async function deployAccount() : Promise<{txHash: string, receiptHash: string}> {
    const deployAccount = httpsCallable(functions, 'deployAccount');
    const result = await deployAccount();
    return result.data as {txHash: string, receiptHash: string};
}

export function prettyPrintTxHash(txHash: string) {
    if (txHash) {
        const len = txHash.length;
        return txHash.substring(0, 6) + "..." + txHash.substring(len - 6, len)
    }
    return "N/A";
}

export function prettyPrintTimestamp(ts: string) {
    const now = new Date().valueOf();
    const epoch = new Date(ts).valueOf();
    const diff = now - epoch;
    if (diff < 60) {
        return now - epoch + " seconds ago";
    } else if (diff < 3600) {
        return Math.floor(diff/60) + " minutes ago";
    } else if (diff < 3600 * 24) {
        return Math.floor(diff/3600) + " hours ago";
    } else {
        return new Date(ts).toLocaleString();
    }
}

export function truncateAddress(address: string) {
    if (!address) return "No Account";
    const match = address.match(
        /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
}

export function toHex(num: any) {
    const val = Number(num);
    return "0x" + val.toString(16);
}
