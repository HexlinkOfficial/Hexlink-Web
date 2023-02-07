import { hexlAccount, hexlContract } from "../../functions/common";
import type { Chain } from "../../functions/common";
import { useAccountStore } from "@/stores/account";
import { getInfuraProvider } from "./network";

export async function initHexlAccount(chain: Chain, nameHash: string) : Promise<void> {
    const provider = getInfuraProvider(chain);
    const hexl = await hexlContract(provider);
    const account = await hexlAccount(provider, hexl, nameHash);
    useAccountStore().setAccount(chain, account);
};