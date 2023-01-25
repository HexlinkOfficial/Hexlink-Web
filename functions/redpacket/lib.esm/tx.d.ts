import type { Chain, UserOp, Transaction } from "../../common";
import type { RedPacket } from "./redpacket";
export declare function buildCreateRedPacketTx(chain: Chain, refunder: string, hexlAccount: string, from: string, input: RedPacket): Transaction[];
export declare function redPacketOps(chain: Chain, input: RedPacket): UserOp[];
