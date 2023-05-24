import { ethers, type BigNumberish } from "ethers";
import {
    Hexlink__factory,
    Account__factory,
    NameStruct
} from '@hexlink/contracts'

import { EntryPoint__factory } from "@account-abstraction/contracts";

import { useAuthStore } from "@/stores/auth";
import { useChainStore } from "@/stores/chain";
import { hash } from "@/web3/utils";

export interface Account {
    name: NameStruct;
    nameHash: string;
    address: string;
    owner: string | undefined;
}

export async function isContract(address: string) : Promise<boolean> {
    try {
        const code = await useChainStore().provider.getCode(address);
        if (code !== '0x') return true;
    } catch (error) {}
    return false;
}

export function getName() {
    return useAuthStore().user!.name;
}

export function getNameHash() {
    return hash(getName());
}

export async function getAccountAddress() {
    const nameHash = getNameHash();
    const hexlink = Hexlink__factory.connect(
        import.meta.env.VITE_ACCOUNT_FACTORY,
        useChainStore().provider
    );
    return await hexlink.ownedAccount(nameHash);
}

export async function getNonce(
    entryPoint: string,
    account: string
) {
    const ep = EntryPoint__factory.connect(
        entryPoint,
        useChainStore().provider
    );
    return await ep.getNonce(account, 0);
}

export function buildAccountExecData(
    target: string,
    value?: BigNumberish,
    data?: string
) {
    const iface = new ethers.utils.Interface(Account__factory.abi);
    return iface.encodeFunctionData("exec", [
      target,
      value ?? 0,
      data ?? []
    ]);
}