"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictErc721Address = exports.buildDeployErc721Ops = exports.buildRedPacketOps = void 0;
const ethers_1 = require("ethers");
const common_1 = require("../../common");
const redpacket_1 = require("./redpacket");
function toHexValue(value) {
    return ethers_1.ethers.utils.hexValue(ethers_1.BigNumber.from(value));
}
function buildGasSponsorshipOps(provider, depositData, redpacket, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const chain = yield (0, common_1.getChainFromProvider)(provider);
        if ((0, common_1.isNativeCoin)(input.gasToken, chain)) {
            return [{
                    name: "depositGasSponsorship",
                    function: "deposit",
                    args: { packetId: input.id, value: input.gasSponsorship },
                    input: {
                        to: redpacket,
                        callGasLimit: "0",
                        callData: depositData,
                        value: toHexValue(input.gasSponsorship),
                    }
                }];
        }
        else {
            const swap = yield (0, redpacket_1.hexlinkSwap)(provider);
            return [
                {
                    name: "approveSwap",
                    function: "approve",
                    args: {
                        operator: swap.address,
                        amount: input.gasSponsorship
                    },
                    input: {
                        to: input.gasToken,
                        callGasLimit: "0",
                        callData: common_1.erc20Interface.encodeFunctionData("approve", [swap.address, input.gasSponsorship]),
                        value: "0",
                    }
                },
                {
                    name: "swapAndDepositGasponsorship",
                    function: "swapAndCall",
                    args: {
                        token: input.gasToken,
                        amountIn: input.gasSponsorship,
                        to: redpacket,
                        data: { deposit: input.id }
                    },
                    input: {
                        to: swap.address,
                        callGasLimit: "0",
                        callData: swap.interface.encodeFunctionData("swapAndCall", [input.gasToken, input.gasSponsorship, redpacket, depositData]),
                        value: "0",
                    }
                }
            ];
        }
    });
}
function buildRedPacketOps(provider, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const packet = {
            creator: input.creator,
            token: input.token,
            salt: input.salt,
            balance: input.balance,
            validator: input.validator,
            split: input.split,
            mode: input.mode,
            sponsorGas: true,
        };
        const redPacket = yield (0, redpacket_1.redPacketContract)(provider);
        const chain = yield (0, common_1.getChainFromProvider)(provider);
        let userOps = [];
        if ((0, common_1.isNativeCoin)(input.token, chain)) {
            userOps.push({
                name: "createRedPacket",
                function: "create",
                args: { packet },
                input: {
                    to: redPacket.address,
                    value: ethers_1.BigNumber.from(packet.balance),
                    callData: redPacket.interface.encodeFunctionData("create", [packet]),
                    callGasLimit: ethers_1.BigNumber.from(0) // no limit
                }
            });
        }
        else {
            userOps = userOps.concat([{
                    name: "approveRedPacket",
                    function: "approve",
                    args: {
                        operator: redPacket.address,
                        amount: packet.balance
                    },
                    input: {
                        to: input.token,
                        value: ethers_1.BigNumber.from(0),
                        callData: common_1.erc20Interface.encodeFunctionData("approve", [redPacket.address, packet.balance]),
                        callGasLimit: ethers_1.BigNumber.from(0) // no limit
                    }
                },
                {
                    name: "createRedPacket",
                    function: "create",
                    args: { packet },
                    input: {
                        to: redPacket.address,
                        value: ethers_1.BigNumber.from(0),
                        callData: redPacket.interface.encodeFunctionData("create", [packet]),
                        callGasLimit: ethers_1.BigNumber.from(0) // no limit
                    }
                }]);
        }
        return userOps.concat(yield buildGasSponsorshipOps(provider, redPacket.interface.encodeFunctionData("deposit", [input.id]), redPacket.address, input));
    });
}
exports.buildRedPacketOps = buildRedPacketOps;
function buildDeployErc721Ops(provider, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const initData = redpacket_1.hexlinkErc721Interface.encodeFunctionData("init", [
            input.name,
            input.symbol,
            input.tokenURI,
            input.split,
            input.validator,
            input.transferrable
        ]);
        const tokenFactory = yield (0, redpacket_1.tokenFactoryContract)(provider);
        let userOps = [];
        userOps.push({
            name: "create_redpacket_erc721",
            function: "deployErc721",
            args: input,
            input: {
                to: tokenFactory.address,
                value: "0",
                callGasLimit: "0",
                callData: tokenFactory.interface.encodeFunctionData("deployErc721", [input.salt, initData])
            }
        });
        return userOps.concat(yield buildGasSponsorshipOps(provider, redpacket_1.hexlinkErc721Interface.encodeFunctionData("deposit", []), input.token, input));
    });
}
exports.buildDeployErc721Ops = buildDeployErc721Ops;
function predictErc721Address(provider, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenFactory = yield (0, redpacket_1.tokenFactoryContract)(provider);
        const salt = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["address", "bytes32"], [input.creator, input.salt]));
        return yield tokenFactory.predictErc721Address(salt);
    });
}
exports.predictErc721Address = predictErc721Address;
