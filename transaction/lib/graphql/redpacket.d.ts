import type { TxStatus, RedPacketClaimInput } from "../types";
export declare const UPDATE_REDPACKET_CLAIM_TX: import("@urql/core").TypedDocumentNode<any, import("@urql/core").AnyVariables>;
export declare function insertRedPacketClaim(data: RedPacketClaimInput[]): Promise<{
    id: string;
}[]>;
export declare function updateRedPacketTxStatus(id: number, txStatus: TxStatus, claimed?: string): Promise<void>;
