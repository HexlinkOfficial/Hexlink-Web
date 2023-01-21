import { ethers, BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";
import type { Token } from "@/types";
import useClipboard from 'vue-clipboard3';
import { createToaster } from "@meforma/vue-toaster";

export function hash(value: string) {
    return ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(value)
    );
}

export function toEthBigNumber(value: BigNumber) : EthBigNumber {
    return EthBigNumber.from(value.toString(10));
}

export function tokenBase(token: Token) : BigNumber {
    return new BigNumber(10).pow(token!.decimals);
}

export function addressEqual(address1: string, address2: string) {
    return EthBigNumber.from(address1).eq(EthBigNumber.from(address2));
}

export function tokenEqual(token1: Token, token2: Token) {
    return EthBigNumber.from(token1.address).eq(
        EthBigNumber.from(token2.address)
    );
}

const { toClipboard } = useClipboard();
export async function copy(text: string) {
    try {
        await toClipboard(text);
        const toaster = createToaster({ position: "top", duration: 2000 });
        toaster.success(`Copied`);
    } catch (e) {
        console.error(e)
        const toaster = createToaster({ position: "top", duration: 2000 });
        toaster.error(`Can not copy`);
    }
}