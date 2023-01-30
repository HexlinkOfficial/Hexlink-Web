import type { OpInput } from "../../functions/common/lib";
export type TxStatus = "" | "error" | "success";
export interface RedPacketClaimInput {
    redPacketId: string;
    creatorId: string;
    tx: string;
    claimerId: string;
    txStatus?: string;
    claimer?: string;
    claimed?: string;
}
export type QueueType = "operation" | "transaction";
export type ActionType = "claim_redpacket" | "create_redpacket";
export interface Action {
    type: ActionType;
    params: any;
}
export interface OperationInput {
    input: OpInput;
    chain: string;
    args: any;
    actions: Action[];
    transaction?: {
        tx: string;
        chain: string;
    };
}
export interface Operation extends OperationInput {
    id: number;
}
