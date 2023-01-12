import { ethers, BigNumber as EthBigNum } from "ethers";
import type { BigNumber } from "bignumber.js";

export function hash(value: string) {
    return ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(value)
    );
}

export function toEthBigNumber(value: BigNumber) {
    return EthBigNum.from(value.toString(10));
}