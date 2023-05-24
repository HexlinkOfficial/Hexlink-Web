import { ethers, BigNumber as EthBigNumber } from "ethers";
import type { Provider } from "@ethersproject/providers";
import { Hexlink__factory, NameStruct } from '@hexlink/contracts'

import { useAuthStore } from "@/stores/auth";
import { useChainStore } from "@/stores/chain";
import { hash } from "@/web3/utils";

export interface Account {
    name: NameStruct;
    nameHash: string;
    address: string;
    owner: string | undefined;
}

async function isContract(provider: Provider, address: string) : Promise<boolean> {
    try {
        const code = await provider.getCode(address);
        if (code !== '0x') return true;
    } catch (error) {}
    return false;
}

export function createNameStruct(input: string, type: "email" | "twitter"): NameStruct {
    // Todo: need to update the handle part for Twitter account or other social accounts
    return {
        schema: hash((type == "email" ? "mailto" : "https").toString()),
        domain: hash((type == "email" ? input.split("@")[1] : input.split(".").pop()!).toString()),
        handle: hash((type == "email" && input).toString()),
    }
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
        const account = Account_factory.connect(
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