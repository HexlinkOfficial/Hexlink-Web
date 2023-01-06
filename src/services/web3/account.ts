import * as ethers from "ethers";
import { getProvider } from "@/services/web3/network";
import * as config from "@/configs/contract";
import type { Account } from "@/types";
import HEXLINK_ABI from "@/configs/HexlinkABI.json";

export function genNameHash(schema: string, name: string) {
    return ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(`${schema}:${name}`)
    );
};

export async function addressOfName(nameHash: string) : Promise<string> {
    const provider = getProvider();
    console.log(provider);
    const hexlink = new ethers.Contract(
        config.HEXLINK,
        HEXLINK_ABI,
        getProvider()
    );
    return await hexlink.addressOfName(nameHash);
}

export async function isContract(address: string): Promise<boolean> {
    try {
        const code = await getProvider().getCode(address);
        if (code !== '0x') return true;
    } catch (error) { }
    return false;
}

export async function buildAccountFromAddress(address: string) : Promise<Account> {
    return {
        address,
        isContract: await isContract(address)
    };
};

export async function buildAccount(nameHash: string) : Promise<Account> {
    console.log(nameHash);
    const address = await addressOfName(nameHash);
    console.log(address);
    return await buildAccountFromAddress(address);
};

export function prettyPrintAddress(address: string, start: number, stop: number) {
    const len = address.length;
    return address.substring(0, start) +
        "..." + address.substring(len - stop, len);
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
