"use strict";
import { ethers, Contract } from "ethers";
import HEXLINK_ABI from "./abi/HEXLINK_ABI.json";
import ADDRESSES from "./addresses.json";
import { getChainFromProvider } from "./chain";
export function hexlAddress(chain) {
    return ADDRESSES[chain.name].hexlink;
}
export function hexlInterface() {
    return new ethers.utils.Interface(HEXLINK_ABI);
}
export async function hexlContract(provider) {
    return new ethers.Contract(hexlAddress(await getChainFromProvider(provider)), HEXLINK_ABI, provider);
}
