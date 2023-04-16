"use strict";
import { ethers } from "ethers";
import { accountInterface } from "./account";
import { hexlContract, hexlInterface } from "./hexlink";
const buildAccountInitData = async (owner) => {
    return accountInterface.encodeFunctionData("init", [owner]);
};
const genRequestId = async function (provider, owner, func) {
    const hexlink = await hexlContract(provider);
    const data = buildAccountInitData(owner);
    const requestId = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes4", "address", "uint256", "bytes"], [
        func,
        hexlink.address,
        (await provider.getNetwork()).chainId,
        data
    ]));
    return requestId;
};
export async function genDeployAuthProof(provider, owner, genAuthProof) {
    const requestId = await genRequestId(provider, owner, hexlInterface.getSighash("deploy"));
    return {
        proof: await genAuthProof({ requestId }),
    };
}
