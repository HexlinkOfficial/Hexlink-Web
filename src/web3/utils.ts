import { BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";
import type { Token } from "@hexlink/hexlink";
import useClipboard from 'vue-clipboard3';
import { createToaster } from "@meforma/vue-toaster";

export function toEthBigNumber(value: BigNumber) : EthBigNumber {
    return EthBigNumber.from(value.toString(10));
}

export function tokenBase(token: Token) : BigNumber {
    return new BigNumber(10).pow(token!.decimals);
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