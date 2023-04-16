import type { Provider } from "@ethersproject/providers";
export declare function genDeployAuthProof(provider: Provider, owner: string, genAuthProof: (request: {
    requestId: string;
}) => Promise<string>): Promise<{
    proof: string;
}>;
