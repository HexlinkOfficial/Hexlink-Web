"use strict";

import {ethers, BigNumber as EthBigNumber} from "ethers";
import {
    hexlinkErc721Interface,
    redPacketAddress,
    redPacketInterface,
    tokenFactoryAddress,
    tokenFactoryInterface
} from "./redpacket";
import type {Chain} from "../../common";
import type {TransactionReceipt} from "@ethersproject/providers";
import type {RedPacket, RedPacketErc721} from "./types";

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
        (e: any) => e.name === "Claimed" && equal(e.args.PacketId, packetId) && equal(e.args.claimer, claimer)
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
        (log: any) => log.address.toLowerCase() === redpacketAddress
    ).map((log: any) => redPacketInterface.parseLog(log));
    const event = events.find(
        (e: any) => e.name === "Created" && equal(e.args.PacketId, packetId)
    );
    return event?.args;
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
                    input.token,
                    input.salt,
                    input.balance,
                    input.validator,
                    input.split,
                    input.mode
                ]
            ]
        )
    );
}

export function redpacketErc721Id(chain: Chain, account: string, input: RedPacketErc721) {
    const redPacketType = "tuple(address,bytes32,uint256,address,uint32,uint8)";
    return ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["uint256", "address", "address", "bytes32"],
            [
                Number(chain.chainId),
                tokenFactoryAddress(chain),
                account,
                input.salt,
            ]
        )
    );
}

export function parseDeployed(
    chain: Chain,
    receipt: TransactionReceipt,
    creator: string,
    salt: string,
) {
    const factoryAddress = tokenFactoryAddress(chain).toLowerCase();
    const events = receipt.logs.filter(
        (log: any) => log.address.toLowerCase() === factoryAddress.toLowerCase()
    ).map((log: any) => tokenFactoryInterface.parseLog(log));
    const event = events.find(
        (e: any) => e.name === "Deployed" && equal(e.args.salt, salt) && equal(e.args.creator, creator)
    );
    return event?.args;
}

export function parseMinted(
    receipt: TransactionReceipt,
    token: string,
    claimer: string,
) {
    const events = receipt.logs.filter(
        (log: any) => log.address.toLowerCase() === token.toLowerCase()
    ).map((log: any) => hexlinkErc721Interface.parseLog(log));
    const event = events.find(
        (e: any) => e.name === "Transfer" && equal(
            e.args.from, ethers.constants.AddressZero
        ) && equal(e.args.to, claimer)
    );
    return event?.args.tokenId;
}