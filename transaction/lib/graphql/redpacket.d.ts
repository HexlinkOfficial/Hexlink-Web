import type { RedPacketClaimInput } from "../types";
import type { HexlinkUserInfo } from "../../../functions/redpacket";
export declare function insertRedPacketClaim(data: RedPacketClaimInput[]): Promise<{
    id: string;
}[]>;
export declare function insertRedPacket(uid: string, data: {
    id: string;
    userId: string;
    creator: HexlinkUserInfo;
    metadata: any;
    opId: number;
    deposit: any;
    type: "erc20" | "erc721";
}[]): Promise<{
    id: string;
}[]>;
