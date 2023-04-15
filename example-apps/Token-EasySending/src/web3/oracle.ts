import { useWalletStore } from "@/stores/wallet";
import { genDeployAuthProof as genProof } from "../../../../functions/common";
import { getFunctions, httpsCallable, type HttpsCallable } from '@firebase/functions'
import { useAuthStore } from "@/stores/auth";
import { useChainStore } from "@/stores/chain";

const functions = getFunctions();

export async function genDeployAuthProof() : Promise<{ proof: string }> {
        const wallet = useWalletStore();
    if (!wallet.connected) {
        throw new Error("Not connected");
    }

    const identityType = useAuthStore().user!.identityType;
    let genAuthProof: HttpsCallable;
    if (identityType === "twitter.com") {
        throw new Error("Twitter login is not supported.")
    } else if (identityType === "email") {
        genAuthProof = httpsCallable(functions, 'genEmailAuthProof');
    }

    return await genProof(
        useChainStore().provider,
        wallet.account!.address,
        async (params: {requestId: string}) => {
            const result = await genAuthProof(params);
            return (result.data as any).proof as string;
        }
    );
}