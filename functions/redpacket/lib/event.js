"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMinted = exports.parseDeployed = exports.redpacketErc721Id = exports.redpacketId = exports.parseCreated = exports.parseClaimed = void 0;
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
    const event = events.find((e) => e.name === "Claimed" && equal(e.args.PacketId, packetId) && equal(e.args.claimer, claimer));
    return event === null || event === void 0 ? void 0 : event.args.amount;
}
exports.parseClaimed = parseClaimed;
function parseCreated(chain, receipt, packetId) {
    const redpacketAddress = (0, redpacket_1.redPacketAddress)(chain).toLowerCase();
    const events = receipt.logs.filter((log) => log.address.toLowerCase() === redpacketAddress).map((log) => redpacket_1.redPacketInterface.parseLog(log));
    const event = events.find((e) => e.name === "Created" && equal(e.args.PacketId, packetId));
    return event === null || event === void 0 ? void 0 : event.args;
}
exports.parseCreated = parseCreated;
function redpacketId(chain, account, input) {
    const redPacketType = "tuple(address,bytes32,uint256,address,uint32,uint8)";
    return ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["uint256", "address", "address", redPacketType], [
        Number(chain.chainId),
        (0, redpacket_1.redPacketAddress)(chain),
        account,
        [
            input.token,
            input.salt,
            input.balance,
            input.validator,
            input.split,
            input.mode
        ]
    ]));
}
exports.redpacketId = redpacketId;
function redpacketErc721Id(chain, account, input) {
    const redPacketType = "tuple(address,bytes32,uint256,address,uint32,uint8)";
    return ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["uint256", "address", "address", "bytes32"], [
        Number(chain.chainId),
        (0, redpacket_1.tokenFactoryAddress)(chain),
        account,
        input.salt,
    ]));
}
exports.redpacketErc721Id = redpacketErc721Id;
function parseDeployed(chain, receipt, creator, salt) {
    const factoryAddress = (0, redpacket_1.tokenFactoryAddress)(chain).toLowerCase();
    const events = receipt.logs.filter((log) => log.address.toLowerCase() === factoryAddress).map((log) => redpacket_1.tokenFactoryInterface.parseLog(log));
    const event = events.find((e) => e.name === "Deployed" && equal(e.args.salt, salt) && equal(e.args.creator, creator));
    return event === null || event === void 0 ? void 0 : event.args;
}
exports.parseDeployed = parseDeployed;
function parseMinted(receipt, token, claimer) {
    const events = receipt.logs.filter((log) => log.address.toLowerCase() === token).map((log) => redpacket_1.hexlinkErc721Interface.parseLog(log));
    const event = events.find((e) => e.name === "Transfer" && equal(e.args.from, ethers_1.ethers.constants.AddressZero) && equal(e.args.creator, claimer));
    return event === null || event === void 0 ? void 0 : event.args.tokenId;
}
exports.parseMinted = parseMinted;
