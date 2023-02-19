"use strict";
import { ethers } from "ethers";
import { getChainFromProvider } from "../../common";
import RED_PACKET_ABI from "./abi/HAPPY_RED_PACKET_ABI.json";
import HEXLINK_ERC721_ABI_V1 from "./abi/HEXLINK_ERC721_ABI_V1.json";
import HEXLINK_TOKEN_FACTORY_ABI from "./abi/HEXLINK_TOKEN_FACTORY_ABI.json";
import ADDRESSES from "./addresses.json";
export const redPacketInterface = new ethers.utils.Interface(RED_PACKET_ABI);
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
export const HEXLINK_ERC721_VERSION_LATEST = 1;
function hexlinkErc721Abi(version) {
    if (version != 1) { // only support version 1 now
        throw new Error("Unsupported version");
    }
    return HEXLINK_ERC721_ABI_V1;
}
export function hexlinkErc721Interface(version) {
    return new ethers.utils.Interface(hexlinkErc721Abi(version || HEXLINK_ERC721_VERSION_LATEST));
}
async function getVersion(address, provider) {
    const abi = [
        "function version() pure returns (uint256)",
    ];
    const contract = new ethers.Contract(address, abi, provider);
    return (await contract.version()).toNumber();
}
export async function hexlinkErc721Contract(address, provider) {
    const version = await getVersion(address, provider);
    return new ethers.Contract(address, hexlinkErc721Abi(version), provider);
}
export async function hexlinkErc721Metadata(erc721) {
    return {
        name: await erc721.name(),
        symbol: await erc721.symbol(),
        validator: await erc721.validator(),
        tokenURI: await erc721.tokenURI(0),
        maxSupply: (await erc721.maxSupply()).toString(),
        transferrable: await erc721.transferrable(),
    };
}
export async function tokenFactory(provider) {
    return new ethers.Contract(tokenFactoryAddress(await getChainFromProvider(provider)), hexlinkErc721Abi(HEXLINK_ERC721_VERSION_LATEST), provider);
}
