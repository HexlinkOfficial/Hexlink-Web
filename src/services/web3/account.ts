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

const genNameHash = function(email: string) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`mailto:${email}`));
};
  
export async function accountAddress(email: string | null | undefined) {
    if (!email) return "";
    const admin = new ethers.Contract(
        config.ADMIN,
        config.ADMIN_ABI,
        getProvider()
    );
    return await admin.addressOfName(genNameHash(email));
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

export function prettyPrintAddress(address: string) {
    if (address) {
        const len = address.length;
        return address.substring(0, 4) + "..." + address.substring(len - 4, len)
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