import type { RedPacketClaimInput, TxStatus } from "./types";
export declare const recordClaimTx: (input: RedPacketClaimInput) => Promise<string>;
export declare const updateClaimTx: (id: number, txStatus: TxStatus) => Promise<void>;
