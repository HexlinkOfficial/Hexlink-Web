import { Chain, Op } from "../../common";
import type { RedPacket } from "./types";
export declare function buildGasSponsorshipOp(hexlAccount: string, refunder: string, input: {
    id: string;
    gasToken: string;
    gasSponsorship: string;
}): Op;
export declare function buildRedPacketOps(chain: Chain, input: RedPacket): Op[];
