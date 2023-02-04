"use strict";
import { ethers } from "ethers";
import HEXLINK_ABI from "./abi/HEXLINK_ABI.json";
import ADDRESSES from "./addresses.json";
import { getChainFromProvider } from "./chain";
export const hexlInterface = new ethers.utils.Interface(HEXLINK_ABI);
export function hexlAddress(chain) {
    return ADDRESSES[chain.name].hexlink;
}
export async function hexlContract(provider) {
    const address = hexlAddress(await getChainFromProvider(provider));
    const contract = new ethers.Contract(address, HEXLINK_ABI, provider);
    return contract;
}
