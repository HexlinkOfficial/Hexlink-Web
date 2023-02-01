"use strict";

import { BigNumber } from "bignumber.js";
import { BigNumber as EthBigNumber } from "ethers";
import type {Token} from "../../common";

export interface HexlinkUserInfo {
    provider: string;
    handle: string;
    displayName?: string;
    logoURI?: string;
}

export interface RedPacket {
    id?: string;
    salt: string;
    mode: "random" | "equal";
    split: number;
    balance: string;
    token: Token;
    tokenAmount?: EthBigNumber;
    gasToken: Token;
    gasTokenAmount?: EthBigNumber;
    validator: string;
}

export interface RedPacketDBMetadata {
    token: string
    salt: string,
    mode: string,
    split: number,
    balance: string,
    validator: string,
    contract: string,
    creator: string,
    gasToken: string,
    tokenAmount?: string,
    gasTokenAmount?: string,
}

export interface PriceInfo {
    nativeCurrencyInUsd: BigNumber,
    gasPrice: EthBigNumber,
    updatedAt: number,
}