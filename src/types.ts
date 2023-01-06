import type { BigNumber } from "ethers";

export interface Network {
    chainId: BigNumber,
    rpcUrls: string[],
    chainName: string,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: Number,
    },
    blockExplorerUrls: string[]
}

export interface Account {
    address: string;
    isContract: boolean;
    balance: BigNumber;
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
    handle: string,
    displayName?: string,
    photoURL?: string,
    nameHash: string,
    account: Account,
}
  
export interface IAuth {
    authenticated: boolean,
    user?: IUser,
    idToken?: string,
    returnUrl?: string,
}