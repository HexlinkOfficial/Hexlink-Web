import type {BigNumber as EthBigNumber} from "ethers";

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

export type QueueType = "operation" | "transaction";