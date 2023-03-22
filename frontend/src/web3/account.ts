import { hexlAccount, hexlContract, nameHash } from "../../../functions/common";
import type { Chain } from "../../../functions/common";
import { useAccountStore } from "@/stores/account";
import { getProvider } from "./network";
import { ethers } from "ethers";

const ACCOUNT_VERSION = undefined; // for test only

export function nameHashWithVersion(provider: string, uid: string) {
    let name = nameHash(provider, uid);
    if (ACCOUNT_VERSION && import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
        name = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(name + "@" + ACCOUNT_VERSION)
        );
    }
    return name;
};

export async function initHexlAccount(chain: Chain, nameHash: string) : Promise<void> {
    const provider = getProvider(chain);
    const hexl = await hexlContract(provider);
    const account = await hexlAccount(provider, hexl, nameHash);
    useAccountStore().setAccount(chain, account, ACCOUNT_VERSION);
};