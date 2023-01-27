import {insertRedPacketClaim, updateRedPacketTxStatus} from "./graphql/redpacket";
import type {RedPacketClaimInput, TxStatus, Operation, OperationType} from "./types";
import {updateTxStatus, insertTx} from "./graphql/transaction";

export const recordClaimTx = async (input: RedPacketClaimInput) => {
  const ids = await insertRedPacketClaim([input]);
  return ids[0].id;
}

export const updateClaimTx = async (id: number, txStatus: TxStatus) => {
  await updateRedPacketTxStatus(id, txStatus);
}

export const recordTx = async (chain: string, tx: string) : Promise<number> => {
  const [{id}] = await insertTx([{chain, tx}]);
  return id;
}

export const updateTx = async (id: number, status: TxStatus) => {
  await updateTxStatus(id, status);
}

export const buildTxFromOp = async (op: Operation) => {

}