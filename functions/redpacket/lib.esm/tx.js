import { ethers, BigNumber as EthBigNumber } from "ethers";
import { isNativeCoin, erc20Interface, getChainFromProvider } from "../../common";
import { redPacketContract, hexlinkErc721Interface, tokenFactoryContract, hexlinkSwap, } from "./redpacket";
function toHexValue(value) {
    return ethers.utils.hexValue(EthBigNumber.from(value));
}
async function buildGasSponsorshipOps(provider, depositData, redpacket, input) {
    const chain = await getChainFromProvider(provider);
    if (isNativeCoin(input.gasToken, chain)) {
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
        const swap = await hexlinkSwap(provider);
        const approveData = erc20Interface.encodeFunctionData("approve", [swap.address, input.gasSponsorship]);
        const swapAndDepositData = swap.interface.encodeFunctionData("swapAndCall", [input.gasToken, input.gasSponsorship, redpacket, depositData]);
        return [
            {
                name: "approve",
                function: "approve",
                args: {
                    operator: swap.address,
                    amount: input.gasSponsorship
                },
                input: {
                    to: input.gasToken,
                    callGasLimit: "0",
                    callData: approveData,
                    value: toHexValue(input.gasSponsorship),
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
                    callData: swapAndDepositData,
                    value: "0",
                }
            }
        ];
    }
}
export async function buildRedPacketOps(provider, input) {
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
    const redPacket = await redPacketContract(provider);
    const chain = await getChainFromProvider(provider);
    let userOps = [];
    if (isNativeCoin(input.token, chain)) {
        userOps.push({
            name: "createRedPacket",
            function: "create",
            args: { packet },
            input: {
                to: redPacket.address,
                value: EthBigNumber.from(packet.balance),
                callData: redPacket.interface.encodeFunctionData("create", [packet]),
                callGasLimit: EthBigNumber.from(0) // no limit
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
                    value: EthBigNumber.from(0),
                    callData: erc20Interface.encodeFunctionData("approve", [redPacket.address, packet.balance]),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            },
            {
                name: "createRedPacket",
                function: "create",
                args: { packet },
                input: {
                    to: redPacket.address,
                    value: EthBigNumber.from(0),
                    callData: redPacket.interface.encodeFunctionData("create", [packet]),
                    callGasLimit: EthBigNumber.from(0) // no limit
                }
            }]);
    }
    return userOps.concat(await buildGasSponsorshipOps(provider, redPacket.interface.encodeFunctionData("deposit", [input.id]), redPacket.address, input));
}
export async function buildDeployErc721Ops(provider, input) {
    const initData = hexlinkErc721Interface.encodeFunctionData("init", [
        input.name,
        input.symbol,
        input.tokenURI,
        input.split,
        input.validator,
        input.transferrable
    ]);
    const tokenFactory = await tokenFactoryContract(provider);
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
    const salt = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "bytes32"], [input.creator, input.salt]));
    return userOps.concat(await buildGasSponsorshipOps(provider, hexlinkErc721Interface.encodeFunctionData("deposit", []), await tokenFactory.predictErc721Address(salt), input));
}
