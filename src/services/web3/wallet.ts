import * as ethers from "ethers";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getProvider } from "./provider";
import * as HEXLINK from "@/data/HEXLINK.json";

const functions = getFunctions();

export interface IMetadata {
    admin: {
        address: string,
        abi: any,
    },
    walletImpl: {
        address: string,
        abi: any,
    },
    token: string,
    wallet: string,
    balance: number,
}

export interface Transaction {
    hash: string,
    from: string,
    to: string,
    amount: number,
    state: "Executing" | "Success" | "Error",
}

const walletImplAddress = function() {
    return ethers.utils.getCreate2Address(
        HEXLINK.adminAddr,
        ethers.constants.HashZero,
        ethers.utils.keccak256(HEXLINK.walletImplBytecode)
    );
};

const genSalt = function(email: string) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`mailto:${email}`));
};
  
export async function genWalletAddress(email: string | null | undefined) {
    if (!email) return "";
    const contract = new ethers.Contract(
        HEXLINK.adminAddr,
        HEXLINK.adminAbi,
        getProvider()
    );
    return await contract.predictWalletAddress(
        HEXLINK.walletImplAddr,
        genSalt(email)
    );
};

export async function getHexlinkMetadata(email: string | null | undefined) : Promise<IMetadata> {
    const getMetadata = httpsCallable(functions, 'metadata');
    const {data} = await getMetadata();
    const {balance} = data as {balance: number};
    return {
        balance,
        admin: {
            address: HEXLINK.adminAddr,
            abi: HEXLINK.adminAbi,
        },
        walletImpl: {
            address: walletImplAddress(),
            abi: HEXLINK.walletImplAbi,
        },
        token: HEXLINK.tokenAddr,
        wallet: await genWalletAddress(email),
    }
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

export async function deployWallet() : Promise<{txHash: string, receiptHash: string}> {
    const deployWallet = httpsCallable(functions, 'deployWallet');
    const result = await deployWallet();
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