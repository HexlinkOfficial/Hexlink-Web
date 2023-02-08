import type { Provider } from "@ethersproject/providers";
import type { AuthProof } from "./types";
export declare function genDeployAuthProof(provider: Provider, nameHash: string, owner: string, data: string | [], genAuthProof: (request: {
    requestId: string;
    version?: number;
}) => Promise<AuthProof>, version?: number): Promise<{
    initData: string;
    proof: AuthProof;
}>;
