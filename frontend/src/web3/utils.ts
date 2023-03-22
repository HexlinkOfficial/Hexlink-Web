import { BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";
import type { Token } from "../../../functions/common";
import useClipboard from 'vue-clipboard3';
import { createToaster } from "@meforma/vue-toaster";
import type { nftImage } from '@/web3/tokens';
import { FastAverageColor } from 'fast-average-color';

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

export async function getBackcgroundColor(nft: nftImage) {
    var output: string = "";
    var url: string = "";
    var opensea: boolean = false;
    if (nft.openSea?.imageUrl != undefined) {
        url = nft.openSea!.imageUrl;
        opensea = true;
    } else {
        if (nft.rawUrl != "") {
            url = nft.rawUrl!;
        } else {
            url = nft.url!;
        }
        opensea = false;
    }
    const fac = new FastAverageColor();
    await fac.getColorAsync(url, { algorithm: 'dominant' })
        .then(color => {
            // container.style.backgroundColor = color.rgba;
            // container.style.color = color.isDark ? '#fff' : '#000';
            output = color.hex.toString();
        })
        .catch(e => {
            console.log(e);
            return e;
        });
    return {
        nft: nft,
        color: output,
        hasOpensea: opensea
    };
};

export const prettyPrintNumber = (amount: string) => {
    if (amount.substring(0, 5) == "0.000") {
        return amount.substring(0, 3) + "..." + amount.slice(-1);
    } else {
        return amount.substring(0, 5);
    }
};