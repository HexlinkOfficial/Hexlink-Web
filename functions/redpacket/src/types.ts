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
    mode: number;
    split: number;
    balance: string;
    token: string;
    validator: string;
    contract?: string,
    creator?: string,
}

export interface RedPacketInput extends RedPacket {
    gasToken: string,
    gasTokenAmount?: string,
}

export interface PriceInfo {
    nativeCurrencyInUsd: BigNumber,
    gasPrice: EthBigNumber,
    updatedAt: number,
}