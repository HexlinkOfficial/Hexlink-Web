import { BigNumber as EthBigNumber } from "ethers";

import type { Chain, Op } from "../../common";
import {
    isNativeCoin,
    isWrappedCoin,
    isStableCoin,
    erc20Interface,
    toEthBigNumber,
    tokenAmount,
    tokenBase
} from "../../common";
import type { RedPacket } from "./redpacket";
import { redPacketInterface, redPacketAddress, redPacketMode } from "./redpacket";
import { BigNumber } from "bignumber.js";

export interface PriceInfo {
    nativeCurrencyInUsd: BigNumber;
    gasPrice: EthBigNumber;
    updatedAt: number;
}

export function calcGasSponsorship(
    chain: Chain,
    redpacket: RedPacket,
    priceInfo: PriceInfo,
) : EthBigNumber {
    const sponsorshipGasAmount = EthBigNumber.from(200000).mul(redpacket.split || 0);
    const gasToken = redpacket.gasToken;
    if (isNativeCoin(gasToken, chain) || isWrappedCoin(gasToken, chain)) {
        return sponsorshipGasAmount.mul(priceInfo.gasPrice);
    } else if (isStableCoin(gasToken, chain)) {
        // calculate usd value of tokens
        const normalizedUsd = tokenBase(gasToken).times(priceInfo.nativeCurrencyInUsd);
        const nativeCoinBase = EthBigNumber.from(10).pow(chain.nativeCurrency.decimals);
        return toEthBigNumber(normalizedUsd).mul(sponsorshipGasAmount).mul(
            priceInfo.gasPrice
        ).div(nativeCoinBase);
    }
    throw new Error("Unsupported gas token");
}

export function buildGasSponsorshipOp(
    chain: Chain,
    input: RedPacket,
    refunder: string,
    hexlAccount: string,
    priceInfo: PriceInfo,
) : Op {
    const sponsorship = calcGasSponsorship(chain, input, priceInfo);
    if (isNativeCoin(input.gasToken, chain)) {
        return {
            name: "depositGasSponsorship",
            function: "",
            args: {},
            input: {
                to: refunder,
                value: sponsorship,
                callData: [],
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        };
    } else {
        return {
            name: "depositGasSponsorship",
            function: "transferFrom",
            args: {
                from: hexlAccount,
                to: refunder,
                amount: sponsorship
            },
            input: {
                to: input.gasToken.address,
                value: EthBigNumber.from(0),
                callData: erc20Interface.encodeFunctionData(
                    "transferFrom", [
                        hexlAccount,
                        refunder,
                        sponsorship
                    ]
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        };
    }
}

export function buildRedPacketOps(
    chain: Chain,
    input: RedPacket
) : Op[] {
    const packet = {
       token: input.token.address,
       salt: input.salt,
       balance: tokenAmount(input.balance, input.token),
       validator: input.validator,
       split: input.split,
       mode: redPacketMode(input.mode),
    };
    const redPacketAddr = redPacketAddress(chain);
    if (isNativeCoin(input.token, chain)) {
        return [{
            name: "createRedPacket",
            function: "create",
            args: {packet},
            input: {
                to: redPacketAddr,
                value: packet.balance,
                callData: redPacketInterface.encodeFunctionData(
                    "create", [packet]
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        }];
    } else {
        return [{
            name: "approveRedPacket",
            function: "approve",
            args: {
                operator: redPacketAddr,
                amount: packet.balance
            },
            input: {
                to: input.token.address,
                value: EthBigNumber.from(0),
                callData: erc20Interface.encodeFunctionData(
                    "approve", [redPacketAddr, packet.balance]
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        },
        {
            name: "createRedPacket",
            function: "create",
            args: {packet},
            input: {
                to: redPacketAddr,
                value: EthBigNumber.from(0),
                callData: redPacketInterface.encodeFunctionData(
                    "create", [packet]
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        }];
    }
}