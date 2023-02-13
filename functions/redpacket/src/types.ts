"use strict";

import type { PriceInfo } from "../../common";

export interface HexlinkUserInfo {
    provider: string;
    handle: string;
    displayName?: string;
    logoURI?: string;
}

export interface GasInput {
    gasToken: string,
    gasSponsorship: string,
    estimatedGas: string,
    priceInfo?: PriceInfo,
}

export interface RedPacket {
    id: string;
    salt: string;
    mode: number;
    split: number;
    balance: string;
    token: string;
    validator: string;
    contract?: string,
    creator?: string,
}

export interface RedPacketErc721 {
    id: string,
    salt?: string,
    name: string,
    symbol: string,
    tokenURI: string,
    maxSupply: string,
    validator: string;
    contract?: string;
    creator?: string;
}

export interface RedPacketInput extends RedPacket, GasInput { }

export interface RedPacketErc721Input extends RedPacketErc721, GasInput { }