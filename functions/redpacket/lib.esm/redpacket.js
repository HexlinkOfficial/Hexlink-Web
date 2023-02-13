"use strict";
import { ethers } from "ethers";
import { getChainFromProvider } from "../../common";
import RED_PACKET_ABI from "./abi/HAPPY_RED_PACKET_ABI.json";
import HEXLINK_ERC721_ABI from "./abi/HEXLINK_ERC721_ABI.json";
import HEXLINK_TOKEN_FACTORY_ABI from "./abi/HEXLINK_TOKEN_FACTORY_ABI.json";
import ADDRESSES from "./addresses.json";
export const redPacketInterface = new ethers.utils.Interface(RED_PACKET_ABI);
export const hexlinkErc721Interface = new ethers.utils.Interface(HEXLINK_ERC721_ABI);
export const tokenFactoryInterface = new ethers.utils.Interface(HEXLINK_TOKEN_FACTORY_ABI);
export function redPacketAddress(chain) {
    return ADDRESSES[chain.name].redpacket;
}
export function tokenFactoryAddress(chain) {
    return ADDRESSES[chain.name].tokenFactory;
}
export async function redPacketContract(provider) {
    return new ethers.Contract(redPacketAddress(await getChainFromProvider(provider)), RED_PACKET_ABI, provider);
}
export async function hexlinkErc721Contract(address, provider) {
    return new ethers.Contract(address, HEXLINK_ERC721_ABI, provider);
}
export async function hexlinkErc721Metadata(erc721) {
    return {
        name: await erc721.name(),
        symbol: await erc721.symbol(),
        validator: await erc721.validator(),
        tokenURI: await erc721.tokenURI(0),
        maxSupply: (await erc721.maxSupply()).toString(),
    };
}
export async function tokenFactory(provider) {
    return new ethers.Contract(tokenFactoryAddress(await getChainFromProvider(provider)), HEXLINK_ERC721_ABI, provider);
}
