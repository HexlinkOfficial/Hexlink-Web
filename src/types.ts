import type { BigNumber as EthersBigNumber } from "ethers";

import type { Token } from "../../functions/common";
import type { RedPacket } from "../../functions/redpacket";

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

export interface CreatedRedPacket {
    id: string;
    salt: string;
    data: RedPacket,
    balanceLeft: EthersBigNumber;
    splitLeft: number;
    gasSponsorshipCost: EthersBigNumber;
    tx: {
        hash: string;
        txCost: EthersBigNumber;
    },
    claimHistory: Claim[]
}

export interface EstimatedTxCost {
    sponsorship: EthersBigNumber;
    currentTx: EthersBigNumber;
    total: EthersBigNumber;
}

export interface HexlinkUserInfo {
    provider: string;
    handle: string;
    displayName?: string;
    logoURI?: string;
}

export interface RedPacketDBMetadata {
    token: string
    salt: string,
    mode: string,
    split: number,
    balance: string,
    validator: string,
    contract: string,
    creator: string,
    gasToken: string,
    tokenAmount?: string,
    gasTokenAmount?: string,
}

export type RedPacketStatus = "pending" | "error" | "alive" | "finalized";

export interface RedPacketOnchainState {
    balance: string,
    split: number,
    createdAt: string
}

export interface RedPacketDB {
    id: string,
    userId: string,
    chain: string,
    metadata: RedPacketDBMetadata,
    creator: HexlinkUserInfo,
    tx: string,
    createdAt: string,
    status?: RedPacketStatus,
    state?: RedPacketOnchainState
}

export interface RedPacketClaimInput {
    redPacketId: string,
    tx: string,
}
  
export type TxStatus = "" | "processing" | "error" | "success";

interface TxState {
    status: TxStatus,
    tx: string,
    chain: string,
    error?: string,
    updatedAt: Date,
}

interface TxStateError {
    error: string,
}
  
export interface RedPacketClaim extends RedPacketClaimInput {
    createdAt: Date,
    id: number,
    claimer: HexlinkUserInfo,
    txStatus?: TxStatus,
    claimed?: EthersBigNumber,
    txState?: TxState | TxStateError | undefined,
}
  
export interface ClaimedRedPacket {
    claim: RedPacketClaim,
    redPacket: RedPacketDB
}