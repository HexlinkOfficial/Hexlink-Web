"use strict";
import { ethers } from "ethers";
import { getChainFromProvider } from "../../common";
import RED_PACKET_ABI from "./HAPPY_RED_PACKET_ABI.json";
import ADDRESSES from "./addresses.json";
export const redPacketInterface = new ethers.utils.Interface(RED_PACKET_ABI);
export function redPacketAddress(chain) {
    return ADDRESSES[chain.name];
}
export async function redPacketContract(provider) {
    return new ethers.Contract(redPacketAddress(await getChainFromProvider(provider)), RED_PACKET_ABI, provider);
}
