"use strict";

import {ethers, BigNumber as EthBigNumber} from "ethers";
import {redPacketAddress} from "./redpacket";
import type {Chain} from "../../common";
import type {TransactionReceipt} from "@ethersproject/providers";
import type {RedPacket} from "./types";
import {redPacketMode} from "./redpacket";

const iface = new ethers.utils.Interface([
    "event Claimed(bytes32 indexed PacketId, address claimer, uint256 amount)",
]);
const legacyIface = new ethers.utils.Interface([
    "event Claimed(bytes32 indexed PacketId, address indexed claimer, uint256 amount)",
]);

const parseClaimedLog = (log: any) => {
    try {
        return iface.parseLog(log);
    } catch(e) {
        return legacyIface.parseLog(log);
    }
}

function equal(one: string | undefined, two: string | undefined) : boolean {
    return (one || "").toLowerCase() == (two || "").toLowerCase();
}

export function parseClaimed(
    chain: Chain,
    receipt: TransactionReceipt,
    packetId: string,
    claimer: string,
) : EthBigNumber | undefined {
    const redpacketAddress = redPacketAddress(chain).toLowerCase();
    const events = receipt.logs.filter(
        (log: any) => log.address.toLowerCase() == redpacketAddress
    ).map((log: any) => parseClaimedLog(log));
    const event = events.find(
        (e: any) => e.name == "Claimed" && equal(e.args.PacketId, packetId) && equal(e.args.claimer, claimer)
    );
    return event?.args.amount;
}

export function parseCreated(
    chain: Chain,
    receipt: TransactionReceipt,
    packetId: string,
) {
    const redpacketAddress = redPacketAddress(chain).toLowerCase();
    const events = receipt.logs.filter(
        (log: any) => log.address.toLowerCase() == redpacketAddress
    ).map((log: any) => parseClaimedLog(log));
    const event = events.find(
        (e: any) => e.name == "Created" && equal(e.args.PacketId, packetId)
    );
    return event ? {
        creator: event.args.creator,
        packet: event.args.packet
    } : undefined;
}


export function redpacketId(chain: Chain, account: string, input: RedPacket) {
    const redPacketType = "tuple(address,bytes32,uint256,address,uint32,uint8)";
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["uint256", "address", "address", redPacketType],
            [
                Number(chain.chainId),
                redPacketAddress(chain),
                account,
                [
                    input.token.address,
                    input.salt,
                    input.tokenAmount,
                    input.validator,
                    input.split,
                    redPacketMode(input.mode)
                ]
            ]
        )
    );
}