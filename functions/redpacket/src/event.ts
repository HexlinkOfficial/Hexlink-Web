"use strict";

import {ethers, BigNumber as EthBigNumber} from "ethers";
import {redPacketAddress} from "./redpacket";
import type {Chain} from "../../common";
import type {TransactionReceipt} from "@ethersproject/providers";

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

function equal(one: string, two: string) : boolean {
    return one.toLowerCase() == two.toLowerCase();
}

export function parseClaimed(
    chain: Chain,
    receipt: TransactionReceipt,
    packetId: string,
    claimer: string,
) {
    const redpacketAddress = redPacketAddress(chain).toLowerCase();
    const events = receipt.logs.filter(
        (log: any) => log.address.toLowerCase() == redpacketAddress
    ).map((log: any) => parseClaimedLog(log));
    const event = events.find(
        (e: any) => e.name == "Claimed" && equal(e.args.packetId, packetId) && equal(e.args.claimer, claimer)
    );
    return event?.args.amount;
}
