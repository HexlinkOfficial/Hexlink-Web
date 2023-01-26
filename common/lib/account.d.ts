import { ethers, Contract } from "ethers";
import type { Provider } from "@ethersproject/providers";
export interface Account {
    address: string;
    isContract: boolean;
    owner?: string;
}
export declare const accountInterface: ethers.utils.Interface;
export declare function nameHash(schema: string, name: string): string;
export declare function accountContract(provider: Provider, address: string): Contract;
export declare function hexlAccount(provider: Provider, hexlink: Contract, nameHash: string): Promise<Account>;
