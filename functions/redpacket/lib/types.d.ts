import type { PriceInfo } from "../../common";
export interface HexlinkUserInfo {
    provider: string;
    handle: string;
    displayName?: string;
    logoURI?: string;
}
export interface GasInput {
    gasToken: string;
    gasSponsorship: string;
    estimatedGas: string;
    priceInfo?: PriceInfo;
}
export type ValidationRuleType = "dynamic_secrets";
export interface ValidationRule {
    type: ValidationRuleType;
}
export interface RedPacketBase {
    id: string;
    salt: string;
    validator: string;
    contract?: string;
    creator?: string;
    validationRules: ValidationRule[];
}
export interface RedPacket extends RedPacketBase {
    mode: number;
    split: number;
    balance: string;
    token: string;
}
export interface RedPacketErc721 extends RedPacketBase {
    name: string;
    symbol: string;
    tokenURI: string;
    split: number;
    transferrable: boolean;
}
export interface RedPacketInput extends RedPacket, GasInput {
}
export interface RedPacketErc721Input extends RedPacketErc721, GasInput {
}
