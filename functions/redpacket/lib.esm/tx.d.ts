import { BigNumber as EthBigNumber } from "ethers";
import { Chain, Op } from "../../common";
import type { RedPacket, RedPacketInput } from "./types";
import { PriceInfo } from "./types";
export declare function calcGasSponsorship(chain: Chain, gasToken: {
    address: string;
    decimals: number;
}, split: number, priceInfo: PriceInfo): EthBigNumber;
export declare function buildGasSponsorshipOp(hexlAccount: string, refunder: string, input: RedPacketInput): Op;
export declare function buildRedPacketOps(chain: Chain, input: RedPacket): Op[];
