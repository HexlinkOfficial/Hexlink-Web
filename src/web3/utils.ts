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

export function addressEqual(address1: string, address2: string) {
    return EthBigNumber.from(address1).eq(EthBigNumber.from(address2));
}

export function tokenEqual(token1: Token, token2: Token) {
    return EthBigNumber.from(token1.metadata.address).eq(
        EthBigNumber.from(token2.metadata.address)
    );
}