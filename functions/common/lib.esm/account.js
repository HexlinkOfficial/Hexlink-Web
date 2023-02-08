"use strict";
import { ethers } from "ethers";
import ACCOUNT_SIMPLE_ABI from "./abi/ACCOUNT_SIMPLE_ABI.json";
import { hash, isContract } from "./utils";
export const DEPLOYMENT_GASCOST = 350000;
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
    return accountInterface.encodeFunctionData("exec", [op]);
}
export function encodeExecBatch(ops) {
    return accountInterface.encodeFunctionData("execBatch", [ops]);
}
export async function encodeValidateAndCall(params) {
    let data;
    if (params.gas) {
        const message = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes", "uint256", "tuple(address, address, uint256, uint256)"], [params.txData, params.nonce, [
                params.gas.receiver,
                params.gas.token,
                params.gas.baseGas,
                params.gas.price
            ]]));
        const signature = await params.sign(message);
        data = accountInterface.encodeFunctionData("validateAndCallWithGasRefund", [
            params.txData,
            params.nonce,
            signature,
            params.gas
        ]);
        return { data, signature };
    }
    else {
        const message = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes", "uint256"], [params.txData, params.nonce]));
        const signature = await params.sign(message);
        data = accountInterface.encodeFunctionData("validateAndCall", [params.txData, params.nonce, signature]);
        return { data, signature };
    }
}
function equal(one, two) {
    return (one || "").toLowerCase() === (two || "").toLowerCase();
}
export function parseDeposit(receipt, ref, from, to) {
    const events = receipt.logs.filter((log) => log.address.toLowerCase() == from.toLowerCase()).map((log) => accountInterface.parseLog(log));
    const event = events.find((e) => e.name === "Deposit" && equal(e.args.ref, ref) && equal(e.args.receipt, to));
    return event?.args;
}
