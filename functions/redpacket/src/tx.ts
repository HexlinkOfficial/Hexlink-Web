import { BigNumber as EthBigNumber, ethers } from "ethers";

import type { Chain, UserOp, Transaction } from "../../common";
import { isNativeCoin, erc20Interface, encodeExecBatch } from "../../common";
import type { RedPacket } from "./redpacket";
import { redPacketInterface, redPacketAddress, redPacketMode } from "./redpacket";

export function buildCreateRedPacketTx(
    chain: Chain,
    refunder: string,
    hexlAccount: string,
    from: string,
    input: RedPacket,
) : Transaction[] {
    let ops: UserOp[] = [];
    let txes: Transaction[] = [];
    if (isNativeCoin(input.gasToken, chain)) {
        ops.push({
            name: "refundGasToken",
            function: "",
            args: [],
            input: {
                to: refunder,
                value: input.gasTokenAmount,
                callData: [],
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        });
    } else {
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
                value: EthBigNumber.from(0),
                callData: erc20Interface.encodeFunctionData(
                    "transferFrom", args
                ),
                callGasLimit: EthBigNumber.from(0) // no limit
            }
        });
    }
    ops = ops.concat(redPacketOps(chain, input));
    const data = encodeExecBatch(ops.map(op => op.input));
    txes.push({
        name: "createRedPacket",
        function: "execBatch",
        args: ops,
        input: {
            to: hexlAccount,
            from,
            data,
            value: ethers.utils.hexValue(0)
        }
    });
    return txes;
}

export function redPacketOps(
    chain: Chain,
    input: RedPacket
) : UserOp[] {
    const packet = {
       token: input.token.address,
       salt: input.salt,
       balance: input.tokenAmount!,
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