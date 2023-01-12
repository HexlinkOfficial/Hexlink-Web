import { ethers, BigNumber as EthBigNum } from "ethers";
import type { Token } from "@/types";
import { useNetworkStore } from '@/stores/network';
import type { BigNumber } from "bignumber.js";

export function hash(value: string) {
    return ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(value)
    );
}

export function isNativeCoin(token: Token) {
    const nativeCoin = useNetworkStore().nativeCoinAddress;
    const tokenAddr = token.metadata.address;
    return tokenAddr.toLowerCase() == nativeCoin.toLowerCase();
}

export function toEthBigNumber(value: BigNumber) {
    return EthBigNum.from(value.toString(10));
}