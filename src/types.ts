import type { BigNumber } from "bignumber.js";
import type { BigNumber as EthersBigNumber } from "ethers";

export interface Network {
    chainId: number,
    rpcUrls: string[],
    name: string,
    chainName: string,
    alchemy: {
        rpcUrl: string,
        key: string,
    },
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number,
        priceInUsd: BigNumber
    },
    blockExplorerUrls: string[],
    logoUrl: string,
    defaultGasPrice: EthersBigNumber,
    contracts: {[key : string]: string | string[]}
}

export interface Account {
    address: string;
    isContract: boolean;
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

export interface TokenMetadata {
    chain?: string,
    address: string,
    name: string,
    symbol: string,
    decimals: number,
    logoURI?: string,
    tags?: string[],
    extensions?: {
        "rootAddress": string
    }
}

export interface TokenDataList {
    tags?: {[key: string]: {name: string, description: string}}
    tokens: TokenMetadata[],
    timestamp: string,
    error?: string,
}

export interface Preference {
    id: number;
    tokenAlias?: string;
    display: boolean;
}

export interface NormalizedTokenBalance {
    value: BigNumber;
    normalized: BigNumber;
    updatedAt: Date;
}

export interface Token {
    metadata: TokenMetadata,
    balance?: NormalizedTokenBalance;
    preference?: Preference;
    price?: number;
}

export interface Profile {
    initiated: boolean;
    account: Account;
    tokens: { [key: string]: Token };
}

export interface RedPacket {
    token: Token;
    gasToken: Token;
    payGasForClaimers: boolean;
    mode: "random" | "equal";
    split: number;
    balance: BigNumber;
    expiredAt: number;
}

export interface RedPacketInput {
    data: RedPacket;
    gasPrice: EthersBigNumber;
    gasSponsorshipCostEstimation?: EthersBigNumber;
    hexlinkAccount: {
        tokenAmount: EthersBigNumber;
        gasTokenAmount: EthersBigNumber;
    },
    walletAccount?: {
        tokenAmount?: EthersBigNumber;
        gasTokenAmount?: EthersBigNumber;
    }
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
    data: RedPacketData,
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

export interface UserOp {
    to: string;
    value: EthersBigNumber;
    callData: string;
    callGasLimit: EthersBigNumber;
}