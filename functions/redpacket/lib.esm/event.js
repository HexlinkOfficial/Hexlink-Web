"use strict";
import { ethers } from "ethers";
import { hexlinkErc721Interface, redPacketAddress, redPacketInterface, tokenFactoryAddress, tokenFactoryInterface } from "./redpacket";
function equal(one, two) {
    return (one || "").toLowerCase() == (two || "").toLowerCase();
}
export function parseClaimed(chain, receipt, packetId, claimer) {
    const redpacketAddress = redPacketAddress(chain).toLowerCase();
    const events = receipt.logs.filter((log) => log.address.toLowerCase() == redpacketAddress).map((log) => redPacketInterface.parseLog(log));
    const event = events.find((e) => e.name === "Claimed" && equal(e.args.PacketId, packetId) && equal(e.args.claimer, claimer));
    return event?.args.amount;
}
export function parseCreated(chain, receipt, packetId) {
    const redpacketAddress = redPacketAddress(chain).toLowerCase();
    const events = receipt.logs.filter((log) => log.address.toLowerCase() === redpacketAddress).map((log) => redPacketInterface.parseLog(log));
    const event = events.find((e) => e.name === "Created" && equal(e.args.PacketId, packetId));
    return event?.args;
}
export function redpacketId(chain, input) {
    const redPacketType = "tuple(address,address,bytes32,uint256,address,uint32,uint8,bool)";
    return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "address", redPacketType], [
        Number(chain.chainId),
        redPacketAddress(chain),
        [
            input.creator,
            input.token,
            input.salt,
            input.balance,
            input.validator,
            input.split,
            input.mode,
            input.sponsorGas
        ]
    ]));
}
export function redpacketErc721Id(chain, input) {
    return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "address", "address", "bytes32"], [
        Number(chain.chainId),
        tokenFactoryAddress(chain),
        input.creator,
        input.salt,
    ]));
}
export function parseDeployed(chain, receipt, creator, salt) {
    const factoryAddress = tokenFactoryAddress(chain).toLowerCase();
    const events = receipt.logs.filter((log) => log.address.toLowerCase() === factoryAddress.toLowerCase()).map((log) => tokenFactoryInterface.parseLog(log));
    const event = events.find((e) => e.name === "Deployed" && equal(e.args.salt, salt) && equal(e.args.creator, creator));
    return event?.args;
}
export function parseMinted(receipt, token, claimer) {
    const events = receipt.logs.filter((log) => log.address.toLowerCase() === token.toLowerCase()).map((log) => hexlinkErc721Interface.parseLog(log));
    const event = events.find((e) => e.name === "Transfer" && equal(e.args.from, ethers.constants.AddressZero) && equal(e.args.to, claimer));
    return event?.args.tokenId;
}
