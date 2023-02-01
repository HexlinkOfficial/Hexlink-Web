import type {BigNumber as EthBigNumber} from "ethers";
import type { OpInput } from "../../functions/common/lib";
import { HexlinkUserInfo } from "../../functions/redpacket/lib";

export type TxStatus = "" | "error" | "success";

export interface RedPacketClaimInput {
  redPacketId: string;
  creatorId: string;
  claimerId: string;
  claimer: HexlinkUserInfo;
  claimed: EthBigNumber;
  opId: number;
}

export type QueueType = "operation" | "transaction" | "coordinator";

export type ActionType = "insert_redpacket_claim" | "insert_redpacket";

export interface Action {
  type: ActionType;
  params: any;
}

export interface OperationInput {
  chain: string;
  type: string;
  userId: string;
  input: OpInput;
  actions: Action[];
  txId?: number;
  account: string,
}

export interface Operation extends OperationInput {
  id: number;
}