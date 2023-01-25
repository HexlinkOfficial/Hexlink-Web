import { BigNumber as EthBigNumber } from "ethers";
import type { Provider } from "@ethersproject/providers";
import { BigNumber } from "bignumber.js";
export declare function hash(value: string): string;
export declare function prettyPrintAddress(address: string, start: number, stop: number): string;
export declare function prettyPrintTxHash(txHash: string): string;
export declare function prettyPrintTimestamp(ts: string): string;
export declare function truncateAddress(address: string): string;
export declare function toHex(num: any): string;
export interface NormalizedTokenBalance {
    value: string;
    normalized: string;
    updatedAt?: Date;
}
export declare function normalizeBalance(balance: string, decimals: number): NormalizedTokenBalance;
export declare function isContract(provider: Provider, address: string): Promise<boolean>;
export declare function toEthBigNumber(value: BigNumber | string | number): EthBigNumber;
