import type { BigNumber as EthersBigNumber } from "ethers";

import type { Token, Deposit } from "../functions/common";
import type { RedPacket, RedPacketErc721 } from "../functions/redpacket";

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