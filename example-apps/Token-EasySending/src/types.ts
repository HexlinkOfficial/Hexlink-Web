import type { BigNumber as EthersBigNumber } from "ethers";


export interface IUser {
    provider: string;
    idType: string;
    name: string;
    handle: string,
    uid: string;
    email?: string;
    providerUid: string;
    displayName?: string;
    photoURL?: string;
    idToken: string;
}
  
export interface IAuth {
    authenticated: boolean,
    user?: Partial<IUser>,
    returnUrl?: string,
    balance?: number,
}

export interface PhoneData {
    country?: string;
    dialCode?: string | number;
    nationalNumber?: string | number;
    number?: string;
    uri?: string;
    isValid?: boolean;
}

export type Country = {
    name: string;
    dialCode: string;
    iso2: string;
}