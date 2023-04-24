import type { Provider } from "@ethersproject/providers";
export declare const buildAccountInitData: (owner: string) => Promise<string>;
export declare const genRequestId: (provider: Provider, owner: string, func: string) => Promise<string>;
export declare function genDeployAuthProof(provider: Provider, owner: string, genAuthProof: (request: {
    requestId: string;
}) => Promise<string>): Promise<{
    proof: string;
}>;
