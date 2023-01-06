import type { BigNumber } from "bignumber.js";
import type { BigNumber as EthersBigNumber } from "ethers";

export interface Network {
    chainId: number,
    rpcUrls: string[],
    name: string,
    chainName: string,
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
    network: string,
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
    account: Account,
}
  
export interface IAuth {
    authenticated: boolean,
    user?: IUser,
    returnUrl?: string,
}

export interface TokenMetadata {
    chainId?: number,
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
    error?: any;
    normalized: BigNumber;
}

export interface Token {
    metadata: TokenMetadata,
    balance?: NormalizedTokenBalance;
    preference?: Preference;
    price?: number;
}