import { ethers } from "ethers";
import type { Chain, OpInput } from "../../functions/common";
import type { Operation } from "./types";
export declare function buildTxFromOps(provider: ethers.providers.Provider, ops: OpInput[], signer: ethers.Wallet): Promise<string>;
export declare function processActions(chain: Chain, op: Operation, receipt: ethers.providers.TransactionReceipt): Promise<void>;
