import { BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";
import type { Token } from "../../../../functions/common";
import useClipboard from 'vue-clipboard3';
import { createToaster } from "@meforma/vue-toaster";
import { ethers } from "ethers";
import {parsePhoneNumber, isValidPhoneNumber} from "libphonenumber-js";

export function hash(value: string): string {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(value));
}

export function toEthBigNumber(value: BigNumber) : EthBigNumber {
    return EthBigNumber.from(value.toString(10));
}

export function tokenBase(token: Token) : BigNumber {
    return new BigNumber(10).pow(token!.decimals);
}

export function tokenEqual(token1: string, token2: string) {
    return EthBigNumber.from(token1).eq(EthBigNumber.from(token2));
}
    
const { toClipboard } = useClipboard();
export async function copy(text: string, message?: string) {
    try {
        await toClipboard(text);
        const toaster = createToaster({ position: "top", duration: 3000 });
        toaster.success(message);
    } catch (e) {
        console.error(e)
        const toaster = createToaster({ position: "top", duration: 3000 });
        toaster.error(`Can not copy`);
    }
}

export function createNotification(message: string, mode: string) {
    try {
        const toaster = createToaster({ position: "top", duration: 3000 });
        if (mode == "success") {
            toaster.success(message);
        } else if (mode == "error") {
            toaster.error(message);
        }
    } catch (error) {
        const toaster = createToaster({ position: "top", duration: 3000 });
        toaster.error(`Error: ${error}`);
    }
}

export const prettyPrintNumber = (amount: string) => {
    if (amount.substring(0, 5) == "0.000") {
        return prettyPrint(amount, 8, 3, -1);
    } else {
        return amount.substring(0, 5);
    }
};

export function prettyPrint(input: string, length: number, firstCut: number, secondCut?: number) {
    if (input.length > length) {
      return input.substring(0, firstCut) + "..." + input.slice(secondCut ?? -4)
    } else {
      return input;
    }
}
  
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
export function isValidEmail(email: string) {
    return EMAIL_REGEX.test(email);
}

export function normalizeEmail(email: string) : string {
    email = email.trim().toLowerCase();
    if (!isValidEmail) {
        throw new Error("invalid email");
    }
    return email
}

export function normalizePhoneNumber(phoneNumber: string) : string {
    if (!isValidPhoneNumber(phoneNumber)) {
        throw new Error("invalid phone number");
    }
    const pn = parsePhoneNumber(phoneNumber)
    return pn.getURI();
}

export function prettyPrintTime(timestamp: Date) : string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60)  {
        return diff + " seconds ago";
    } else if (diff < 3600) {
        return Math.floor(diff / 60) + " minutes ago";
    } else if (diff < 86400) {
        return Math.floor(diff / 3600) + " hours ago";
    } else {
        return timestamp.toLocaleString().split('T')[0];
    }
}