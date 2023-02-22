import { BigNumber as EthBigNumber } from "ethers";
import { Chain, Op, accountInterface } from "../../common";
import { isNativeCoin, erc20Interface } from "../../common";
import type {RedPacket, RedPacketInput} from "./types";
import { redPacketInterface, redPacketAddress } from "./redpacket";

export function buildRedPacketOps(
    chain: Chain,
    input: RedPacket
) : Op[] {
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