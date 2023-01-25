"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redPacketOps = exports.buildCreateRedPacketTx = void 0;
const ethers_1 = require("ethers");
const common_1 = require("../../common");
const redpacket_1 = require("./redpacket");
function buildCreateRedPacketTx(chain, refunder, hexlAccount, from, input) {
    let ops = [];
    let txes = [];
    if ((0, common_1.isNativeCoin)(input.gasToken, chain)) {
        ops.push({
            name: "refundGasToken",
            function: "",
            args: [],
            input: {
                to: refunder,
                value: input.gasTokenAmount,
                callData: [],
                callGasLimit: ethers_1.BigNumber.from(0) // no limit
            }
        });
    }
    else {
        const args = [
            hexlAccount,
            refunder,
            input.gasTokenAmount
        ];
        ops.push({
            name: "refundGasToken",
            function: "transferFrom",
            args,
            input: {
                to: input.gasToken.address,
                value: ethers_1.BigNumber.from(0),
                callData: common_1.erc20Interface.encodeFunctionData("transferFrom", args),
                callGasLimit: ethers_1.BigNumber.from(0) // no limit
            }
        });
    }
    ops = ops.concat(redPacketOps(chain, input));
    const data = (0, common_1.encodeExecBatch)(ops.map(op => op.input));
    txes.push({
        name: "createRedPacket",
        function: "execBatch",
        args: ops,
        input: {
            to: hexlAccount,
            from,
            data,
            value: ethers_1.ethers.utils.hexValue(0)
        }
    });
    return txes;
}
exports.buildCreateRedPacketTx = buildCreateRedPacketTx;
function redPacketOps(chain, input) {
    const packet = {
        token: input.token.address,
        salt: input.salt,
        balance: input.tokenAmount,
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
exports.redPacketOps = redPacketOps;
