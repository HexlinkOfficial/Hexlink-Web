"use strict";

import {ethers, Contract} from "ethers";
import type {Provider} from "@ethersproject/providers";
import {getChainFromProvider} from "../../common";
import type {Chain} from "../../common";
import RED_PACKET_ABI from "./abi/HAPPY_RED_PACKET_ABI.json";
import ADDRESSES from "./addresses.json";

export const redPacketInterface = new ethers.utils.Interface(RED_PACKET_ABI);

export function redPacketAddress(chain: Chain) : string {
  return (ADDRESSES as any)[chain.name] as string;
}

export async function redPacketContract(
    provider: Provider
) : Promise<Contract> {
  return new ethers.Contract(
      redPacketAddress(await getChainFromProvider(provider)),
      RED_PACKET_ABI,
      provider
  );
}

export function redPacketMode(mode: string) : number {
  return mode == "random" ? 2 : 1;
}