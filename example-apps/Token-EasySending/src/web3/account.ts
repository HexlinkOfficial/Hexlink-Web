import { ethers, BigNumber as EthBigNumber } from "ethers";
import type { Provider } from "@ethersproject/providers";
import { Hexlink__factory, NameStruct } from '@hexlink/contracts'

import { useAuthStore } from "@/stores/auth";
import { useChainStore } from "@/stores/chain";
import { hash } from "@/web3/utils";

export function getName(): NameStruct {
    const user = useAuthStore().user!;
    return {
        schema: hash(user.schema),
        domain: hash(user.domain),
        handle: hash(user.handle),
    };
}

export function getNameHash() {
    const name = getName();
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ['bytes32', 'bytes32', 'bytes32'],
            [name.schema, name.domain, name.handle]
        )
    );
}

export async function getAddressOfName(provider: Provider) {
    const hexlink = Hexlink__factory.connect(
        import.meta.env.ACCOUNT_FACTORY,
        provider
    );
    return await hexlink.ownedAccouunt(getNameHash());
}