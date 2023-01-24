"use strict";
import { ethers } from "ethers";
import { accountInterface } from "./account";
import { hexlContract, hexlInterface } from "./hexlink";
const genRequestId = async function (provider, nameHash, func, data) {
    const hexlink = await hexlContract(provider);
    const result = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes4", "bytes", "address", "uint256", "uint256"], [
        func,
        data,
        hexlink.address,
        (await provider.getNetwork()).chainId,
        await hexlink.nonce(nameHash),
    ]));
    return result;
};
export async function genDeployAuthProof(provider, nameHash, owner, data, genAuthProof) {
    const initData = accountInterface.encodeFunctionData("init", [owner, data]);
    const requestId = await genRequestId(provider, nameHash, hexlInterface.getSighash("deploy"), initData);
    return {
        initData,
        proof: await genAuthProof({ requestId }),
    };
}
