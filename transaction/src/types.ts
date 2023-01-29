export type TxStatus = "" | "queued" | "pending" | "error" | "success";

export interface RedPacketClaimInput {
  redPacketId: string,
  creatorId: string,
  tx: string,
  claimerId: string,
  txStatus?: string,
  claimer?: string,
  claimed?: string
}

type Action = "claim_redpacket" | "create_redpacket";

export interface Operation {
  to: string;
  data: string;
  actions: Action[];
}

export type QueueType = "operation" | "transaction";