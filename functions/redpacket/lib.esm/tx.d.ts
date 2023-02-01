import { BigNumber as EthBigNumber } from "ethers";
import { Chain, Op } from "../../common";
import type { RedPacket } from "./types";
import { PriceInfo } from "./types";
export declare function calcGasSponsorship(chain: Chain, redpacket: RedPacket, priceInfo: PriceInfo): EthBigNumber;
export declare function buildGasSponsorshipOp(hexlAccount: string, refunder: string, input: RedPacket): Op;
export declare function buildRedPacketOps(chain: Chain, input: RedPacket): Op[];
