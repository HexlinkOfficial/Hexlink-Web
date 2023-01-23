"use strict";

import { ethers, Contract } from "ethers";
import type { BigNumber as EthBigNumber  } from "ethers";
import type { Provider } from "@ethersproject/providers";
import { getChainFromProvider } from "@hexlink/hexlink";
import type { Token, Chain } from "@hexlink/hexlink";
import RED_PACKET_ABI from "./HAPPY_RED_PACKET_ABI.json";
import ADDRESSES from "./addresses.json";

export interface RedPacket {
    id?: string;
    salt: string;
    mode: "random" | "equal";
    split: number;
    balance: string;
    token: Token;
    tokenAmount?: EthBigNumber;
    gasToken: Token;
    gasTokenAmount?: EthBigNumber;
    validator: string;
}

export function redPacketInterface() : ethers.utils.Interface {
    return new ethers.utils.Interface(RED_PACKET_ABI);
}

export function redPacketAddress(chain: Chain) : string {
    return (ADDRESSES as any)[chain.name] as string;
}

export async function redPacketContract(provider: Provider) : Promise<Contract> {
    return new ethers.Contract(
        redPacketAddress(await getChainFromProvider(provider)),
        RED_PACKET_ABI,
        provider
    )
}