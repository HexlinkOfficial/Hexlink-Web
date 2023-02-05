import { ethers, Contract } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Chain } from "../../common";
export declare const redPacketInterface: ethers.utils.Interface;
export declare function redPacketAddress(chain: Chain): string;
export declare function redPacketContract(provider: Provider): Promise<Contract>;
