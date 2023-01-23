import { useWalletStore } from "@/stores/wallet";
import { genDeployAuthProof as genProof } from "@hexlink/hexlink";
import type { AuthProof } from "@hexlink/hexlink";
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useAuthStore } from "@/stores/auth";
import { useChainStore } from "@/stores/chain"

const functions = getFunctions();

export async function genDeployAuthProof(
    data: string
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
        async (param) => {
            const result = await genAuthProof(param);
            return (result.data as any).authProof as AuthProof;
        }
    );
}