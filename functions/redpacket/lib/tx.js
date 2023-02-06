"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRedPacketOps = exports.buildGasSponsorshipOp = void 0;
const ethers_1 = require("ethers");
const common_1 = require("../../common");
const common_2 = require("../../common");
const redpacket_1 = require("./redpacket");
function buildGasSponsorshipOp(hexlAccount, refunder, input) {
    return {
        name: "depositGasSponsorship",
        function: "deposit",
        args: {
            ref: input.id,
            receipt: refunder,
            token: input.gasToken,
            amount: input.gasSponsorship
        },
        input: {
            to: hexlAccount,
            value: ethers_1.BigNumber.from(0),
            callData: common_1.accountInterface.encodeFunctionData("deposit", [
                input.id,
                refunder,
                input.gasToken,
                input.gasSponsorship
            ]),
            callGasLimit: ethers_1.BigNumber.from(0) // no limit
        }
    };
}
exports.buildGasSponsorshipOp = buildGasSponsorshipOp;
function buildRedPacketOps(chain, input) {
    const packet = {
        token: input.token,
        salt: input.salt,
        balance: input.balance,
        validator: input.validator,
        split: input.split,
        mode: input.mode,
    };
    const redPacketAddr = (0, redpacket_1.redPacketAddress)(chain);
    if ((0, common_2.isNativeCoin)(input.token, chain)) {
        return [{
                name: "createRedPacket",
                function: "create",
                args: { packet },
                input: {
                    to: redPacketAddr,
                    value: ethers_1.BigNumber.from(packet.balance),
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
                    to: input.token,
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
