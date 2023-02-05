import type { RedPacketClaimInput } from "../types";
import type { RedPacket, HexlinkUserInfo } from "../../../functions/redpacket";
export declare function insertRedPacketClaim(data: RedPacketClaimInput[]): Promise<{
    id: string;
}[]>;
export declare function insertRedPacket(uid: string, data: {
    id: string;
    userId: string;
    creator: HexlinkUserInfo;
    metadata: RedPacket;
    opId: number;
    deposit: any;
}[]): Promise<{
    id: string;
}[]>;
