import { BigNumber as EthBigNumber } from "ethers";
import type { Chain, Op } from "../../common";
import type { RedPacket } from "./redpacket";
import { BigNumber } from "bignumber.js";
export interface PriceInfo {
    nativeCurrencyInUsd: BigNumber;
    gasPrice: EthBigNumber;
    updatedAt: number;
}
export declare function calcGasSponsorship(chain: Chain, redpacket: RedPacket, priceInfo: PriceInfo): EthBigNumber;
export declare function buildGasSponsorshipOp(chain: Chain, input: RedPacket, refunder: string, hexlAccount: string, priceInfo: PriceInfo): Op;
export declare function buildRedPacketOps(chain: Chain, input: RedPacket): Op[];
