import type { BigNumber as EthersBigNumber } from "ethers";

import type { Token } from "../../functions/common";
import type { RedPacket, RedPacketErc721 } from "../../functions/redpacket";

// if uid exists, use uid as key to
// generate address otherwise use handle
export interface IUser {
    provider: string,
    identityType: string,
    authType: string,
    uid: string,
    providerUid: string,
    handle: string,
    displayName?: string,
    photoURL?: string,
    nameHash: string,
    idToken: string,
}
  
export interface IAuth {
    authenticated: boolean,
    user?: IUser,
    returnUrl?: string,
}

export interface Claim {
    from: string,
    claimed: EthersBigNumber;
    gasSponsorshipCost: EthersBigNumber;
    tx: {
        hash: string;
        timestamp: number;
        txCost: EthersBigNumber;
    }
}

export interface ClaimCardData {
    twitter: string,
    token: Token,
    from: string
}

export interface HexlinkUserInfo {
    provider: string;
    handle: string;
    displayName?: string;
    logoURI?: string;
}

export interface RedPacketClaim {
    createdAt: Date,
    claimer: HexlinkUserInfo,
    claimed?: string,
}

export interface RedPacketOnchainState {
    balanceLeft: string,
    claimsLeft: number,
    sponsorship: string,
}

export interface RedPacketDB {
    id: string,
    metadata: RedPacket | RedPacketErc721,
    creator?: HexlinkUserInfo,
    createdAt: Date,
    state?: RedPacketOnchainState,
    token?: Token,
    chain?: string,
    validationData?: any[],
    type: "erc20" | "erc721",
}

export interface Op {
    id: number,
    createdAt: Date,
    type: string
    tx?: string,
    txStatus?: string,
    chain?: string,
    error?: string,
}
  
export interface CreateRedPacketOp extends Op {
    type: "create_redpacket",
    redpacket?: RedPacketDB,
}

export interface ClaimRedPacketOp extends Op {
    type: "claim_redpacket",
    claim?: RedPacketClaim,
    redpacket?: RedPacketDB,
}
  