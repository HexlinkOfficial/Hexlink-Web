import type { BigNumber as EthersBigNumber } from "ethers";
import type { BigNumber } from "bignumber.js";

export interface Network {
    name: string,
    chainId?: string,
    rpcUrls: string[],
    chainName: string,
    alchemy: {
        rpcUrl: string,
        key: string,
    },
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number,
    },
    blockExplorerUrls: string[],
    logoUrl: string,
    address: {[key : string]: string | string[]}
}

export interface PriceInfo {
    nativeCurrencyInUsd: BigNumber;
    gasPrice: EthersBigNumber;
    updatedAt: number;
}

export interface Account {
    address: string;
    isContract: boolean;
    owner?: string;
}

export interface Wallet {
    wallet: string;
    walletIcon: string;
    account: Account;
}

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

export interface Token {
    chain?: string,
    chainId: string | number,
    address: string,
    name: string,
    symbol: string,
    decimals: number,
    logoURI?: string,
    tags?: string[],
    extensions?: {
        "rootAddress": string
    },
    preference?: Preference
}

export interface TokenDataList {
    tags?: {[key: string]: {name: string, description: string}}
    tokens: Token[],
    timestamp: string,
    error?: string,
}

export interface Preference {
    id: number;
    tokenAlias?: string;
    display: boolean;
}

export interface NormalizedTokenBalance {
    value: EthersBigNumber;
    normalized: string;
    updatedAt?: Date;
}

export interface Profile {
    initiated: boolean;
    account: Account;
    tokens: { [key: string]: Token };
}

export interface RedPacket {
    id?: string;
    salt: string;
    mode: "random" | "equal";
    split: number;
    balance: string;
    token: Token;
    tokenAmount?: EthersBigNumber;
    gasToken: Token;
    gasTokenAmount?: EthersBigNumber;
    validator: string;
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

export interface AuthProof {
    name: string,
    requestId: string,
    authType: string, // non-hashed
    identityType: string, // non-hashed
    issuedAt: number, // timestamp
    signature: string // encoded with validator address
}

export interface AuthProof {
    name: string,
    requestId: string,
    authType: string, // non-hashed
    identityType: string, // non-hashed
    issuedAt: number, // timestamp
    signature: string // encoded with validator address
}

export interface EstimatedTxCost {
    sponsorship: EthersBigNumber;
    currentTx: EthersBigNumber;
    total: EthersBigNumber;
}

export interface Transaction {
    name: string,
    function: string,
    args: any[],
    tx: {
        to: string
        from: string,
        value?: string,
        data: string,
    }
}

export interface UserOp {
    name: string,
    function: string,
    args: any[],
    op: {
        to: string;
        value: EthersBigNumber;
        callData: string | [];
        callGasLimit: EthersBigNumber;
    }
}

export interface HexlinkUserInfo {
    provider: string;
    handle: string;
    displayName?: string;
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
  
export interface RedPacketDB {
    id: string,
    userId: string,
    chain: string,
    metadata: RedPacketDBMetadata,
    creator: HexlinkUserInfo,
    tx: string,
    createdAt: string,
    status?: RedPacketStatus,
}

export interface RedPacketClaimInput {
    redPacketId: string,
    tx: string,
}
  
export type TxStatus = "" | "pending" | "error" | "success";
  
export interface RedPacketClaim extends RedPacketClaimInput {
    createdAt: Date,
    id: number,
    claimer: HexlinkUserInfo,
    txStatus?: TxStatus,
    claimed?: EthersBigNumber,
}
  
export interface ClaimedRedPacket {
    claim: RedPacketClaim,
    redPacket: RedPacketDB
}