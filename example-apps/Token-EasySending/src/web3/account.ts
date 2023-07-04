import { ethers, type BigNumberish } from "ethers";
import {
    Hexlink__factory,
    Account__factory,
} from '@hexlink/contracts'

import { EntryPoint__factory } from "@account-abstraction/contracts";

import { useAuthStore } from "@/stores/auth";
import { useChainStore } from "@/stores/chain";
import { hash } from "@/web3/utils";

export async function isContract(address: string) : Promise<boolean> {
    try {
        const code = await useChainStore().provider.getCode(address);
        if (code !== '0x') return true;
    } catch (error) {}
    return false;
}

export function getNameType() {
    return useAuthStore().user!.idType;
}

export function getName() {
    return useAuthStore().user!.handle;
}

export async function getAccountAddress(nameType?: string, name?: string) {
    const hexlink = Hexlink__factory.connect(
        import.meta.env.VITE_ACCOUNT_FACTORY_V2,
        useChainStore().provider
    );
    nameType = hash(nameType || getNameType());
    name = hash(name || getName());
    return await hexlink.getOwnedAccount(nameType, name);
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
    data?: string | []
) {
    const iface = new ethers.utils.Interface(Account__factory.abi);
    return iface.encodeFunctionData("execute", [{
        target,
        value: value ?? 0,
        data: data ?? ""
    }]);
}
