import { ethers, Contract } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Chain } from "../../common";
export declare const redPacketInterface: ethers.utils.Interface;
export declare const hexlinkErc721Interface: ethers.utils.Interface;
export declare const tokenFactoryInterface: ethers.utils.Interface;
export declare function redPacketAddress(chain: Chain): string;
export declare function tokenFactoryAddress(chain: Chain): string;
export declare function redPacketContract(provider: Provider): Promise<Contract>;
export declare function hexlinkErc721Contract(address: string, provider: Provider): Promise<Contract>;
export declare function hexlinkErc721Metadata(erc721: Contract): Promise<{
    name: any;
    symbol: any;
    validator: any;
    tokenURI: any;
    maxSupply: any;
}>;
export declare function tokenFactory(provider: Provider): Promise<Contract>;
