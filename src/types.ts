import type { BigNumber } from "bignumber.js";

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
        decimals: Number,
    },
    blockExplorerUrls: string[],
    logoUrl: string,
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

export interface RedPacketData {
    token: Token;
    gasToken: Token;
    enableGasStation: boolean;
    mode: "random" | "equal";
    split: Number;
    balance: BigNumber;
    expiredAt: Number;

}

export interface CreatingRedPacket {
    data: RedPacketData;
    gasSponsorshipCostMin: BigNumber;
    gasSponsorshipCostMax: BigNumber;
    txCostMin: BigNumber;
    txCostMax: BigNumber;
}

export interface Claim {
    from: string,
    claimed: BigNumber;
    gasSponsorshipCost: BigNumber;
    tx: {
        hash: string;
        timestamp: number;
        txCost: BigNumber;
    }
}

export interface CreatedRedPacket {
    id: string;
    salt: string;
    data: RedPacketData,
    balanceLeft: BigNumber;
    splitLeft: number;
    gasSponsorshipCost: BigNumber;
    tx: {
        hash: string;
        txCost: BigNumber;
    },
    claimHistory: Claim[]
}