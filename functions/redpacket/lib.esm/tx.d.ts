import { ethers } from "ethers";
import type { Op } from "../../common";
import type { RedPacketInput, RedPacketErc721Input } from "./types";
export declare function buildRedPacketOps(provider: ethers.providers.Provider, input: RedPacketInput): Promise<Op[]>;
export declare function buildDeployErc721Ops(provider: ethers.providers.Provider, input: RedPacketErc721Input): Promise<Op[]>;
