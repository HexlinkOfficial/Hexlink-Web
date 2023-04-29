import type { BigNumber as EthersBigNumber } from "ethers";


export interface IUser {
    provider: string;
    schema: string;
    domain: string;
    handle: string;
    uid: string;
    providerUid: string;
    displayName?: string;
    photoURL?: string;
    idToken: string;
}
  
export interface IAuth {
    authenticated: boolean,
    user?: IUser,
    returnUrl?: string,
}