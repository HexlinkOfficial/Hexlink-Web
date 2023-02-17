import { useWalletStore } from "@/stores/wallet";
import { genDeployAuthProof as genProof } from "../../functions/common";
import type { AuthProof } from "../../functions/common";
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useAuthStore } from "@/stores/auth";
import { useChainStore } from "@/stores/chain";
import { useAccountStore } from "@/stores/account";

const functions = getFunctions();

export async function genDeployAuthProof(
    data: string | [],
    version?: number,
) : Promise<{ initData: string, proof: AuthProof }> {
    const wallet = useWalletStore();
    if (!wallet.connected) {
        throw new Error("Not connected");
    }

    const genAuthProof = httpsCallable(functions, 'genTwitterOAuthProof');
    return await genProof(
        useChainStore().provider,
        useAuthStore().user!.nameHash,
        wallet.account!.address,
        data,
        async (params: {requestId: string, version?: number}) => {
            const result = await genAuthProof(params);
            return (result.data as any).authProof as AuthProof;
        },
        useAccountStore().version,
    );
}