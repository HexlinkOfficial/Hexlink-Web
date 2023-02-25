"use strict";

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
}

export type ValidationRuleType = "dynamic_secrets";

export interface ValidationRule {
  type: ValidationRuleType,
}

export interface RedPacketBase {
    id: string;
    salt: string;
    validator: string;
    creator: string;
    sponsorGas: boolean;
    contract?: string;
    type: "erc20" | "erc721";
    validationRules: ValidationRule[];
    opId?: number,
    token: string;
}

export interface RedPacket extends RedPacketBase {
    mode: number;
    split: number;
    balance: string;
}

export interface RedPacketErc721 extends RedPacketBase {
    name: string,
    symbol: string,
    tokenURI: string,
    split: number,
    maxSupply: number, // same with split
    transferrable: boolean,
}

export interface RedPacketInput extends RedPacket, GasInput {
}

export interface RedPacketErc721Input extends RedPacketErc721, GasInput { }