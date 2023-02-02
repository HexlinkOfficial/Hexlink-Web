import { ethers } from "ethers";
import type { Chain } from "../../functions/common";
import type { Operation } from "./types";
export declare function buildTxFromOps(provider: ethers.providers.Provider, chain: Chain, ops: Operation[], signer: ethers.Wallet): Promise<string>;
export declare function processActions(chain: Chain, op: Operation, receipt: ethers.providers.TransactionReceipt): Promise<void>;
