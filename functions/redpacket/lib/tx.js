"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRedPacketOps = exports.buildGasSponsorshipOp = exports.calcGasSponsorship = void 0;
const ethers_1 = require("ethers");
const common_1 = require("../../common");
const common_2 = require("../../common");
const redpacket_1 = require("./redpacket");
function calcGasSponsorship(chain, redpacket, priceInfo) {
    const sponsorshipGasAmount = ethers_1.BigNumber.from(200000).mul(redpacket.split || 0);
    const gasToken = redpacket.gasToken;
    if ((0, common_2.isNativeCoin)(gasToken, chain) || (0, common_2.isWrappedCoin)(gasToken, chain)) {
        return sponsorshipGasAmount.mul(priceInfo.gasPrice);
    }
    else if ((0, common_2.isStableCoin)(gasToken, chain)) {
        // calculate usd value of tokens
        const normalizedUsd = (0, common_2.tokenBase)(gasToken).times(priceInfo.nativeCurrencyInUsd);
        const nativeCoinBase = ethers_1.BigNumber.from(10).pow(chain.nativeCurrency.decimals);
        return (0, common_2.toEthBigNumber)(normalizedUsd).mul(sponsorshipGasAmount).mul(priceInfo.gasPrice).div(nativeCoinBase);
    }
    throw new Error("Unsupported gas token");
}
exports.calcGasSponsorship = calcGasSponsorship;
function buildGasSponsorshipOp(chain, input, refunder, hexlAccount, priceInfo) {
    const sponsorship = calcGasSponsorship(chain, input, priceInfo);
    return {
        name: "depositGasSponsorship",
        function: "deposit",
        args: {
            ref: input.id,
            receipt: refunder,
            token: input.gasToken,
            amount: sponsorship
        },
        input: {
            to: hexlAccount,
            value: ethers_1.BigNumber.from(0),
            callData: common_1.accountInterface.encodeFunctionData("deposit", [
                input.id,
                refunder,
                input.gasToken,
                sponsorship
            ]),
            callGasLimit: ethers_1.BigNumber.from(0) // no limit
        }
    };
}
exports.buildGasSponsorshipOp = buildGasSponsorshipOp;
function buildRedPacketOps(chain, input) {
    const packet = {
        token: input.token.address,
        salt: input.salt,
        balance: (0, common_2.tokenAmount)(input.balance, input.token),
        validator: input.validator,
        split: input.split,
        mode: (0, redpacket_1.redPacketMode)(input.mode),
    };
    const redPacketAddr = (0, redpacket_1.redPacketAddress)(chain);
    if ((0, common_2.isNativeCoin)(input.token, chain)) {
        return [{
                name: "createRedPacket",
                function: "create",
                args: { packet },
                input: {
                    to: redPacketAddr,
                    value: packet.balance,
                    callData: redpacket_1.redPacketInterface.encodeFunctionData("create", [packet]),
                    callGasLimit: ethers_1.BigNumber.from(0) // no limit
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
                    value: ethers_1.BigNumber.from(0),
                    callData: common_2.erc20Interface.encodeFunctionData("approve", [redPacketAddr, packet.balance]),
                    callGasLimit: ethers_1.BigNumber.from(0) // no limit
                }
            },
            {
                name: "createRedPacket",
                function: "create",
                args: { packet },
                input: {
                    to: redPacketAddr,
                    value: ethers_1.BigNumber.from(0),
                    callData: redpacket_1.redPacketInterface.encodeFunctionData("create", [packet]),
                    callGasLimit: ethers_1.BigNumber.from(0) // no limit
                }
            }];
    }
}
exports.buildRedPacketOps = buildRedPacketOps;
