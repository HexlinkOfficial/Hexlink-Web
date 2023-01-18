import type { BigNumber as EthersBigNumber } from "ethers";
import type { BigNumber } from "bignumber.js";

export interface Network {
    chainId: string,
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
    value: EthersBigNumber;
    normalized: string;
    updatedAt?: Date;
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
    id?: string;
    token: Token;
    salt: string;
    gasToken: Token;
    gasTokenAmount?: EthersBigNumber;
    tokenAmount?: EthersBigNumber;
    mode: "random" | "equal";
    split: number;
    balance: string;
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