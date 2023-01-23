import { hexlAccount, hexlContract } from "@hexlink/hexlink";
import type { Chain } from "@hexlink/hexlink";
import { useChainStore } from "@/stores/chain";
import { useAccountStore } from "@/stores/account";

const chainStore = useChainStore();
export async function initHexlAccount(chain: Chain, nameHash: string) : Promise<void> {
    const provider = chainStore.provider;
    const hexl = await hexlContract(provider);
    const account = await hexlAccount(provider, hexl, nameHash);
    useAccountStore().setAccount(chain, account);
};