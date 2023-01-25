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
export function encodeValidateAndCall(params) {
    const txData = encodeExecBatch(params.ops);
    if (params.gas) {
        return accountInterface.encodeFunctionData("validateAndCall", [txData, params.nonce, params.signature]);
    }
    else {
        return accountInterface.encodeFunctionData("validateAndCallWithGasRefund", [txData, params.nonce, params.signature, params.gas]);
    }
}
