import type { Provider } from "@ethersproject/providers";
export interface AuthProof {
    name: string;
    requestId: string;
    authType: string;
    identityType: string;
    issuedAt: number;
    signature: string;
}
export declare function genDeployAuthProof(provider: Provider, nameHash: string, owner: string, data: string, genAuthProof: (request: {
    requestId: string;
}) => Promise<AuthProof>): Promise<{
    initData: string;
    proof: AuthProof;
}>;
//# sourceMappingURL=oracle.d.ts.map