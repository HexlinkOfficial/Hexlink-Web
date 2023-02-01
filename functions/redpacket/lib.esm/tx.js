import { BigNumber as EthBigNumber } from "ethers";
import { accountInterface } from "../../common";
import { isNativeCoin, isWrappedCoin, isStableCoin, erc20Interface, toEthBigNumber, tokenBase } from "../../common";
import { redPacketInterface, redPacketAddress, redPacketMode } from "./redpacket";
export function calcGasSponsorship(chain, redpacket, priceInfo) {
    const sponsorshipGasAmount = EthBigNumber.from(200000).mul(redpacket.split || 0);
    const gasToken = redpacket.gasToken;
    if (isNativeCoin(gasToken, chain) || isWrappedCoin(gasToken, chain)) {
        return sponsorshipGasAmount.mul(priceInfo.gasPrice);
    }
    else if (isStableCoin(gasToken, chain)) {
        // calculate usd value of tokens
        const normalizedUsd = tokenBase(gasToken).times(priceInfo.nativeCurrencyInUsd);
        const nativeCoinBase = EthBigNumber.from(10).pow(chain.nativeCurrency.decimals);
        return toEthBigNumber(normalizedUsd).mul(sponsorshipGasAmount).mul(priceInfo.gasPrice).div(nativeCoinBase);
    }
    throw new Error("Unsupported gas token");
}
export function buildGasSponsorshipOp(hexlAccount, refunder, input) {
    return {
        name: "depositGasSponsorship",
        function: "deposit",
        args: {
            ref: input.id,
            receipt: refunder,
            token: input.gasToken.address,
            amount: input.gasTokenAmount
        },
        input: {
            to: hexlAccount,
            value: EthBigNumber.from(0),
            callData: accountInterface.encodeFunctionData("deposit", [
                input.id,
                refunder,
                input.gasToken.address,
                input.gasTokenAmount
            ]),
            callGasLimit: EthBigNumber.from(0) // no limit
        }
    };
}
export function buildRedPacketOps(chain, input) {
    const packet = {
        token: input.token.address,
        salt: input.salt,
        balance: input.balance,
        validator: input.validator,
        split: input.split,
        mode: redPacketMode(input.mode),
    };
    const redPacketAddr = redPacketAddress(chain);
    if (isNativeCoin(input.token, chain)) {
        return [{
                name: "createRedPacket",
                function: "create",
                args: { packet },
                input: {
                    to: redPacketAddr,
                    value: packet.balance,
                    callData: redPacketInterface.encodeFunctionData("create", [packet]),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            }];
    }
    else {
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
                    callData: erc20Interface.encodeFunctionData("approve", [redPacketAddr, packet.balance]),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            },
            {
                name: "createRedPacket",
                function: "create",
                args: { packet },
                input: {
                    to: redPacketAddr,
                    value: EthBigNumber.from(0),
                    callData: redPacketInterface.encodeFunctionData("create", [packet]),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            }];
    }
}
