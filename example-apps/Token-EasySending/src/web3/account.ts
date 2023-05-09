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

export function getNameFromEmail(email: string): NameStruct {
    const [handle, domain] = email.split("@");
    return {
        schema: hash("mailto"),
        domain: hash(domain),
        handle: hash(handle),
    };
}

export function getName(): NameStruct {
    const user = useAuthStore().user!;
    return {
        schema: hash(user.schema),
        domain: hash(user.domain),
        handle: hash(user.handle),
    };
}

export function getNameHash(name?: NameStruct) {
    if (!name) { name = getName(); }
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ['bytes32', 'bytes32', 'bytes32'],
            [name.schema, name.domain, name.handle]
        )
    );
}

export async function getAccountAddress(name?: NameStruct) {
    if (!name) { name = getName(); }
    const hexlink = Hexlink__factory.connect(
        import.meta.env.VITE_ACCOUNT_FACTORY,
        useChainStore().provider
    );
    return await hexlink.ownedAccount(getNameHash(name));
}

export async function getAccountOwner(
    address?: string
) : Promise<undefined | string> {
    if (!address) { address = await getAccountAddress(); }
    if (await isContract(address)) {
        const account = Account__factory.connect(
            address,
            useChainStore().provider
        );
        return await account.owner();
    }
    return undefined;
}

export async function getAccount() : Promise<Account> {
    const name = getName();
    const nameHash = getNameHash(name);
    const address = await getAccountAddress(name);
    return {
        name,
        nameHash,
        address,
        owner: await getAccountOwner(address)
    }
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