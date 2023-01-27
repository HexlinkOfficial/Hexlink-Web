import { BigNumber as EthBigNumber, ethers } from "ethers";

import type { Chain, UserOp, Transaction } from "../../common";
import {
    isNativeCoin,
    isWrappedCoin,
    isStableCoin,
    erc20Interface,
    encodeExecBatch,
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
    const sponsorshipGasAmount = EthBigNumber.from(200000).mul(redpacket.split);
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

function buildGasSponsorshipOp(
    chain: Chain,
    input: RedPacket,
    refunder: string,
    hexlAccount: string,
    priceInfo: PriceInfo,
) : UserOp {
    const gasTokenAmount = calcGasSponsorship(chain, input, priceInfo);
    if (isNativeCoin(input.gasToken, chain)) {
        return {
            name: "refundGasToken",
            function: "",
            args: [],
            input: {
                to: refunder,
                value: gasTokenAmount,
                callData: [],
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        };
    } else {
        const args = [
            hexlAccount,
            refunder,
            gasTokenAmount
        ];
        return {
            name: "refundGasToken",
            function: "transferFrom",
            args,
            input: {
                to: input.gasToken.address,
                value: EthBigNumber.from(0),
                callData: erc20Interface.encodeFunctionData(
                    "transferFrom", args
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        };
    }
}

export function buildRedPacketOps(
    chain: Chain,
    input: RedPacket
) : UserOp[] {
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
            args: [packet],
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
            args: [redPacketAddr, packet.balance],
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
            args: [packet],
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

export function buildCreateRedPacketTx(
    chain: Chain,
    refunder: string,
    hexlAccount: string,
    ops: UserOp[],
    input: RedPacket,
    from: string,
    priceInfo: PriceInfo,
) : Transaction {
    ops.push(buildGasSponsorshipOp(chain, input, refunder, hexlAccount, priceInfo));
    ops = ops.concat(buildRedPacketOps(chain, input));
    const data = encodeExecBatch(ops.map(op => op.input));
    return {
        name: "createRedPacket",
        function: "execBatch",
        args: ops,
        input: {
            to: hexlAccount,
            from,
            data,
            value: ethers.utils.hexValue(0)
        }
    };
}