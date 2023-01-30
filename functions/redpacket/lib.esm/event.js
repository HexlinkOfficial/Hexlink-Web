"use strict";
import { ethers } from "ethers";
import { redPacketAddress } from "./redpacket";
const iface = new ethers.utils.Interface([
    "event Claimed(bytes32 indexed PacketId, address claimer, uint256 amount)",
]);
const legacyIface = new ethers.utils.Interface([
    "event Claimed(bytes32 indexed PacketId, address indexed claimer, uint256 amount)",
]);
const parseClaimedLog = (log) => {
    try {
        return iface.parseLog(log);
    }
    catch (e) {
        return legacyIface.parseLog(log);
    }
};
function equal(one, two) {
    return one.toLowerCase() == two.toLowerCase();
}
export function parseClaimed(chain, receipt, packetId, claimer) {
    const redpacketAddress = redPacketAddress(chain).toLowerCase();
    const events = receipt.logs.filter((log) => log.address.toLowerCase() == redpacketAddress).map((log) => parseClaimedLog(log));
    const event = events.find((e) => e.name == "Claimed" && equal(e.args.packetId, packetId) && equal(e.args.claimer, claimer));
    return event?.args.amount;
}
