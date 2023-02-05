import { BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";
import type { Token } from "../../functions/common";
import useClipboard from 'vue-clipboard3';
import { createToaster } from "@meforma/vue-toaster";

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