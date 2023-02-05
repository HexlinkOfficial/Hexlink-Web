import { BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";

import { Chain, Op, accountInterface } from "../../common";
import {
    isNativeCoin,
    isWrappedCoin,
    isStableCoin,
    erc20Interface,
    toEthBigNumber,
} from "../../common";
import type {RedPacket, RedPacketInput} from "./types";
import { redPacketInterface, redPacketAddress } from "./redpacket";
import {PriceInfo} from "./types";

export function calcGasSponsorship(
    chain: Chain,
    gasToken: {
        address: string,
        decimals: number,
    },
    split: number,
    priceInfo: PriceInfo,
) : EthBigNumber {
    const sponsorshipGasAmount = EthBigNumber.from(200000).mul(split || 0);
    if (isNativeCoin(gasToken.address, chain) || isWrappedCoin(gasToken.address, chain)) {
        return sponsorshipGasAmount.mul(priceInfo.gasPrice);
    } else if (isStableCoin(gasToken.address, chain)) {
        // calculate usd value of tokens
        const normalizedUsd = new BigNumber(10).pow(
            gasToken.decimals
        ).times(priceInfo.nativeCurrencyInUsd);
        const nativeCoinBase = EthBigNumber.from(
            10
        ).pow(chain.nativeCurrency.decimals);
        return toEthBigNumber(normalizedUsd).mul(
            sponsorshipGasAmount
        ).mul(
            priceInfo.gasPrice
        ).div(nativeCoinBase);
    }
    throw new Error("Unsupported gas token");
}

export function buildGasSponsorshipOp(
    hexlAccount: string,
    refunder: string,
    input: RedPacketInput,
) : Op {
    return {
        name: "depositGasSponsorship",
        function: "deposit",
        args: {
            ref: input.id,
            receipt: refunder,
            token: input.gasToken,
            amount: input.gasTokenAmount
        },
        input: {
            to: hexlAccount,
            value: EthBigNumber.from(0),
            callData: accountInterface.encodeFunctionData(
                "deposit", [
                    input.id,
                    refunder,
                    input.gasToken,
                    input.gasTokenAmount
                ]
            ),
            callGasLimit: EthBigNumber.from(0) // no limit
        }
    };
}

export function buildRedPacketOps(
    chain: Chain,
    input: RedPacket
) : Op[] {
    const packet = {
       token: input.token,
       salt: input.salt,
       balance: input.balance,
       validator: input.validator,
       split: input.split,
       mode: input.mode,
    };
    const redPacketAddr = redPacketAddress(chain);
    if (isNativeCoin(input.token, chain)) {
        return [{
            name: "createRedPacket",
            function: "create",
            args: {packet},
            input: {
                to: redPacketAddr,
                value: EthBigNumber.from(packet.balance),
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
                to: input.token,
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