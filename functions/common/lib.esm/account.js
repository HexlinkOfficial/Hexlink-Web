"use strict";
import { ethers } from "ethers";
import ACCOUNT_SIMPLE_ABI from "./abi/ACCOUNT_SIMPLE_ABI.json";
import { hash, isContract } from "./utils";
export const accountInterface = new ethers.utils.Interface(ACCOUNT_SIMPLE_ABI);
export function nameHash(schema, name) {
    return hash(`${schema}:${name}`);
}
export function accountContract(provider, address) {
    return new ethers.Contract(address, ACCOUNT_SIMPLE_ABI, provider);
}
export async function hexlAccount(provider, hexlink, nameHash) {
    const address = await hexlink.addressOfName(nameHash);
    const acc = {
        address,
        isContract: await isContract(provider, address),
    };
    if (acc.isContract) {
        const contract = accountContract(provider, address);
        acc.owner = await contract.owner();
    }
    return acc;
}
export function encodeInit(owner, data) {
    return accountInterface.encodeFunctionData("init", [owner, data]);
}
export function encodeExec(op) {
    return accountInterface.encodeFunctionData("execBatch", [op]);
}
export function encodeExecBatch(ops) {
    return accountInterface.encodeFunctionData("execBatch", [ops]);
}
export async function encodeValidateAndCall(params) {
    const nonce = await params.account.nonce();
    const txData = encodeExecBatch(params.ops);
    const message = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes", "uint256"], [txData, nonce]));
    const signature = await params.sign(message);
    let data;
    if (params.gas) {
        data = params.account.interface.encodeFunctionData("validateAndCallWithGasRefund", [txData, nonce, signature, params.gas]);
    }
    else {
        data = params.account.interface.encodeFunctionData("validateAndCall", [txData, nonce, signature]);
    }
    return { data, signature, nonce };
}
function equal(one, two) {
    return (one || "").toLowerCase() == (two || "").toLowerCase();
}
export function parseDeposit(receipt, ref, from, to) {
    const events = receipt.logs.filter((log) => log.address.toLowerCase() == from.toLowerCase()).map((log) => accountInterface.parseLog(log));
    const event = events.find((e) => e.name == "Created" && equal(e.args.ref, ref) && equal(e.args.receipt, to));
    return event?.args;
}
