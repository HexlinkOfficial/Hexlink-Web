import { ethers, BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";
import type { Token } from "@/types";

export function hash(value: string) {
    return ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(value)
    );
}

export function toEthBigNumber(value: BigNumber) : EthBigNumber {
    return EthBigNumber.from(value.toString(10));
}

export function tokenBase(token: Token) : BigNumber {
    return new BigNumber(10).pow(token.metadata!.decimals);
}