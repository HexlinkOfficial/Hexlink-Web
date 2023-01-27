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

export type OperationType = {
  app: string;
  op: string;
}

export const createRedPacket : OperationType = {
  app: "redpacket",
  op: "create",
}

export const claimRedPacket : OperationType = {
  app: "redpacket",
  op: "claim",
}

export const deployAccount : OperationType = {
  app: "hexlink",
  op: "deploy",
}

export interface Operation {
  to: string;
  data: string;
  types: OperationType[];
}