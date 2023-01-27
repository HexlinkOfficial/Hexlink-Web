"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCreateRedPacketTx = exports.buildRedPacketOps = exports.calcGasSponsorship = void 0;
const ethers_1 = require("ethers");
const common_1 = require("../../common");
const redpacket_1 = require("./redpacket");
function calcGasSponsorship(chain, redpacket, priceInfo) {
    const sponsorshipGasAmount = ethers_1.BigNumber.from(200000).mul(redpacket.split);
    const gasToken = redpacket.gasToken;
    if ((0, common_1.isNativeCoin)(gasToken, chain) || (0, common_1.isWrappedCoin)(gasToken, chain)) {
        return sponsorshipGasAmount.mul(priceInfo.gasPrice);
    }
    else if ((0, common_1.isStableCoin)(gasToken, chain)) {
        // calculate usd value of tokens
        const normalizedUsd = (0, common_1.tokenBase)(gasToken).times(priceInfo.nativeCurrencyInUsd);
        const nativeCoinBase = ethers_1.BigNumber.from(10).pow(chain.nativeCurrency.decimals);
        return (0, common_1.toEthBigNumber)(normalizedUsd).mul(sponsorshipGasAmount).mul(priceInfo.gasPrice).div(nativeCoinBase);
    }
    throw new Error("Unsupported gas token");
}
exports.calcGasSponsorship = calcGasSponsorship;
function buildGasSponsorshipOp(chain, input, refunder, hexlAccount, priceInfo) {
    const gasTokenAmount = calcGasSponsorship(chain, input, priceInfo);
    if ((0, common_1.isNativeCoin)(input.gasToken, chain)) {
        return {
            name: "refundGasToken",
            function: "",
            args: [],
            input: {
                to: refunder,
                value: gasTokenAmount,
                callData: [],
                callGasLimit: ethers_1.BigNumber.from(0) // no limit
            }
        };
    }
    else {
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
                value: ethers_1.BigNumber.from(0),
                callData: common_1.erc20Interface.encodeFunctionData("transferFrom", args),
                callGasLimit: ethers_1.BigNumber.from(0) // no limit
            }
        };
    }
}
function buildRedPacketOps(chain, input) {
    const packet = {
        token: input.token.address,
        salt: input.salt,
        balance: (0, common_1.tokenAmount)(input.balance, input.token),
        validator: input.validator,
        split: input.split,
        mode: (0, redpacket_1.redPacketMode)(input.mode),
    };
    const redPacketAddr = (0, redpacket_1.redPacketAddress)(chain);
    if ((0, common_1.isNativeCoin)(input.token, chain)) {
        return [{
                name: "createRedPacket",
                function: "create",
                args: [packet],
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
                args: [redPacketAddr, packet.balance],
                input: {
                    to: input.token.address,
                    value: ethers_1.BigNumber.from(0),
                    callData: common_1.erc20Interface.encodeFunctionData("approve", [redPacketAddr, packet.balance]),
                    callGasLimit: ethers_1.BigNumber.from(0) // no limit
                }
            },
            {
                name: "createRedPacket",
                function: "create",
                args: [packet],
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
function buildCreateRedPacketTx(chain, refunder, hexlAccount, ops, input, from, priceInfo) {
    ops.push(buildGasSponsorshipOp(chain, input, refunder, hexlAccount, priceInfo));
    ops = ops.concat(buildRedPacketOps(chain, input));
    const data = (0, common_1.encodeExecBatch)(ops.map(op => op.input));
    return {
        name: "createRedPacket",
        function: "execBatch",
        args: ops,
        input: {
            to: hexlAccount,
            from,
            data,
            value: ethers_1.ethers.utils.hexValue(0)
        }
    };
}
exports.buildCreateRedPacketTx = buildCreateRedPacketTx;
