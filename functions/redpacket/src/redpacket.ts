"use strict";

import {ethers, Contract} from "ethers";
import type {Provider} from "@ethersproject/providers";
import {getChainFromProvider} from "../../common";
import type {Chain} from "../../common";
import RED_PACKET_ABI from "./abi/HAPPY_RED_PACKET_ABI.json";
import HEXLINK_ERC721_ABI from "./abi/HEXLINK_ERC721_ABI.json";
import HEXLINK_TOKEN_FACTORY_ABI from "./abi/HEXLINK_TOKEN_FACTORY_ABI.json";
import ADDRESSES from "./addresses.json";

export const redPacketInterface = new ethers.utils.Interface(RED_PACKET_ABI);
export const hexlinkErc721Interface =
  new ethers.utils.Interface(HEXLINK_ERC721_ABI);
export const tokenFactoryInterface =
  new ethers.utils.Interface(HEXLINK_TOKEN_FACTORY_ABI);

export function redPacketAddress(chain: Chain) : string {
  return (ADDRESSES as any)[chain.name].redpacket as string;
}

export function tokenFactoryAddress(chain: Chain) : string {
  return (ADDRESSES as any)[chain.name].tokenFactory as string;
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

export async function hexlinkErc721Contract(
  address: string,
  provider: Provider
) : Promise<Contract> {
  return new ethers.Contract(
      address,
      HEXLINK_ERC721_ABI,
      provider
  );
}

export async function hexlinkErc721Metadata(erc721: Contract) {
  return {
    name: await erc721.name(),
    symbol: await erc721.symbol(),
    validator: await erc721.validator(),
    tokenURI: await erc721.tokenURI(),
    maxSupply: await erc721.maxSupply(),
  }
}

export async function tokenFactory(
  provider: Provider
) : Promise<Contract> {
  return new ethers.Contract(
      tokenFactoryAddress(await getChainFromProvider(provider)),
      HEXLINK_ERC721_ABI,
      provider
  );
}