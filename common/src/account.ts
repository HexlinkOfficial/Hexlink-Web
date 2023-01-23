"use strict";

import { ethers, Contract } from "ethers";
import type { Provider } from "@ethersproject/providers";
import ACCOUNT_SIMPLE_ABI from "./abi/ACCOUNT_SIMPLE_ABI.json";
import { hash } from "./utils";
import { isContract } from "./utils";

export interface Account {
    address: string,
    isContract: boolean,
    owner?: string,
}

export function accountInterface() : ethers.utils.Interface {
    return new ethers.utils.Interface(ACCOUNT_SIMPLE_ABI);
}

export function nameHash(schema: string, name: string) {
    return hash(`${schema}:${name}`);
};

export function accountContract(provider: Provider, address: string) : Contract {
    return new ethers.Contract(
        address,
        ACCOUNT_SIMPLE_ABI,
        provider
    )
}

export async function hexlAccount(
    provider: Provider,
    hexlink: Contract,
    nameHash: string
) : Promise<Account> {
    const address = await hexlink.addressOfName(nameHash);
    const acc = {
        address,
        isContract: await isContract(provider, address)
    } as Account;
    if (acc.isContract) {
        const contract = accountContract(provider, address);
        acc.owner = await contract.owner();
    }
    return acc;
};