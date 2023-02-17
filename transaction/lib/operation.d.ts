import { ethers, PopulatedTransaction } from "ethers";
import type { Chain } from "../../functions/common";
import type { Operation } from "./types";
export declare function buildTx(provider: ethers.providers.Provider, chain: Chain, unsignedTx: PopulatedTransaction, from: string): Promise<ethers.PopulatedTransaction>;
export declare function processActions(chain: Chain, op: Operation, receipt: ethers.providers.TransactionReceipt): Promise<void>;
