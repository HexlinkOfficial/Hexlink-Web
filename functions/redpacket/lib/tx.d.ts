import { BigNumber as EthBigNumber } from "ethers";
import type { Chain, UserOp, Transaction } from "../../common";
import type { RedPacket } from "./redpacket";
import { BigNumber } from "bignumber.js";
export interface PriceInfo {
    nativeCurrencyInUsd: BigNumber;
    gasPrice: EthBigNumber;
    updatedAt: number;
}
export declare function calcGasSponsorship(chain: Chain, redpacket: RedPacket, priceInfo: PriceInfo): EthBigNumber;
export declare function buildRedPacketOps(chain: Chain, input: RedPacket): UserOp[];
export declare function buildCreateRedPacketTx(chain: Chain, refunder: string, hexlAccount: string, ops: UserOp[], input: RedPacket, from: string, priceInfo: PriceInfo): Transaction;
