import { ethers, Contract } from "ethers";
import type { Provider } from "@ethersproject/providers";
export declare const erc20Interface: ethers.utils.Interface;
export declare function erc20Contract(provider: Provider, address: string): Contract;
