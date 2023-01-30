import type { RedPacketClaimInput } from "../types";
export declare const UPDATE_REDPACKET_CLAIM: import("@urql/core").TypedDocumentNode<any, import("@urql/core").AnyVariables>;
export declare function insertRedPacketClaim(data: RedPacketClaimInput[]): Promise<{
    id: string;
}[]>;
export declare function updateRedPacketClaim(id: number, claimed?: string): Promise<void>;
