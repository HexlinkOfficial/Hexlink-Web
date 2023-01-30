"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseClaimed = void 0;
const ethers_1 = require("ethers");
const redpacket_1 = require("./redpacket");
const iface = new ethers_1.ethers.utils.Interface([
    "event Claimed(bytes32 indexed PacketId, address claimer, uint256 amount)",
]);
const legacyIface = new ethers_1.ethers.utils.Interface([
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
    return (one || "").toLowerCase() == (two || "").toLowerCase();
}
function parseClaimed(chain, receipt, packetId, claimer) {
    const redpacketAddress = (0, redpacket_1.redPacketAddress)(chain).toLowerCase();
    const events = receipt.logs.filter((log) => log.address.toLowerCase() == redpacketAddress).map((log) => parseClaimedLog(log));
    console.log(packetId);
    console.log(claimer);
    console.log(events);
    const event = events.find((e) => e.name == "Claimed" && equal(e.args.PacketId, packetId) && equal(e.args.claimer, claimer));
    return event === null || event === void 0 ? void 0 : event.args.amount;
}
exports.parseClaimed = parseClaimed;
