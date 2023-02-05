import { Chain, Op } from "../../common";
import type { RedPacket, RedPacketInput } from "./types";
export declare function buildGasSponsorshipOp(hexlAccount: string, refunder: string, input: RedPacketInput): Op;
export declare function buildRedPacketOps(chain: Chain, input: RedPacket): Op[];
