"use strict";

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
    gasTokenAmount: string,
    priceInfo?: PriceInfo,
}

export interface PriceInfo {
    nativeCurrencyInUsd: string,
    gasPrice: string,
    updatedAt: number,
}