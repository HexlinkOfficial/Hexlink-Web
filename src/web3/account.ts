import type { Account, Network } from "@/types";
import { hexlinkContract } from "@/web3/hexlink";
import { getProvider } from "@/web3/network";
import { hash } from "@/web3/utils";
import { Contract } from "ethers";
import ACCOUNT_ABI from "@/configs/abi/AccountSimple.json";
import { useAccountStore } from "@/stores/account";

export function genNameHash(schema: string, name: string) {
    return hash(`${schema}:${name}`);
};

export async function isContract(address: string): Promise<boolean> {
    try {
        const code = await getProvider().getCode(address);
        if (code !== '0x') return true;
    } catch (error) { }
    return false;
}

export function accountContract(network: Network, address: string): Contract {
    return new Contract(address, ACCOUNT_ABI, getProvider(network));
}

export async function buildAccountFromAddress(address: string) : Promise<Account> {
    return {
        address,
        isContract: await isContract(address)
    };
};

export async function initHexlAccount(network: Network, nameHash: string) : Promise<void> {
    const address = await hexlinkContract(network).addressOfName(nameHash);
    const account = await buildAccountFromAddress(address);
    if (account.isContract) {
        const contract = accountContract(network, address);
        account.owner = await contract.owner();
    }
    useAccountStore().setAccount(network, account);
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