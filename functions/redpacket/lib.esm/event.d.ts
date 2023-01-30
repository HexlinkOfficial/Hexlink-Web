import { BigNumber as EthBigNumber } from "ethers";
import type { Chain } from "../../common";
import type { TransactionReceipt } from "@ethersproject/providers";
export declare function parseClaimed(chain: Chain, receipt: TransactionReceipt, packetId: string, claimer: string): EthBigNumber | undefined;
