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
export async function setAccountOwner(provider, account) {
    const address = account.address;
    account.isContract = await isContract(provider, address);
    if (account.isContract) {
        const contract = accountContract(provider, address);
        account.owner = await contract.owner();
    }
    return account;
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
        const message = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes", "uint256", "tuple(address, address, address, uint256)"], [params.txData, params.nonce, [
                params.gas.swapper,
                params.gas.token,
                params.gas.receiver,
                params.gas.baseGas,
            ]]));
        const signature = await params.sign(message);
        data = accountInterface.encodeFunctionData("validateAndCallWithGasRefund", [
            params.txData,
            params.nonce,
            params.gas,
            signature,
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
