import {insertRedPacketClaim, updateRedPacketTxStatus} from "./graphql/redpacket";
import type {RedPacketClaimInput, TxStatus} from "./types";


export const recordClaimTx = async (input: RedPacketClaimInput) => {
  const ids = await insertRedPacketClaim([input]);
  return ids[0].id;
}

export const updateClaimTx = async (id: number, txStatus: TxStatus) => {
  await updateRedPacketTxStatus(id, txStatus);
}
