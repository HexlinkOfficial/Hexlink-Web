"use strict";
import { ethers, Contract } from "ethers";
import ACCOUNT_SIMPLE_ABI from "./abi/ACCOUNT_SIMPLE_ABI.json";
import { hash } from "./utils";
import { isContract } from "./utils";
export function accountInterface() {
    return new ethers.utils.Interface(ACCOUNT_SIMPLE_ABI);
}
export function nameHash(schema, name) {
    return hash(`${schema}:${name}`);
}
;
export function accountContract(provider, address) {
    return new ethers.Contract(address, ACCOUNT_SIMPLE_ABI, provider);
}
export async function hexlAccount(provider, hexlink, nameHash) {
    const address = await hexlink.addressOfName(nameHash);
    const acc = {
        address,
        isContract: await isContract(provider, address)
    };
    if (acc.isContract) {
        const contract = accountContract(provider, address);
        acc.owner = await contract.owner();
    }
    return acc;
}
;
