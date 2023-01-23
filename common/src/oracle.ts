"use strict";

import type { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { accountInterface } from "./account";
import { hexlContract, hexlInterface } from "./hexlink";

export interface AuthProof {
    name: string,
    requestId: string,
    authType: string, // non-hashed
    identityType: string, // non-hashed
    issuedAt: number, // timestamp
    signature: string // encoded with validator address
}

const genRequestId = async function(
    provider: Provider,
    nameHash: string,
    func: string,
    data: string | [],
) {
    const hexlink = await hexlContract(provider);
    const result = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["bytes4", "bytes", "address", "uint256", "uint256"],
        [
            func,
            data,
            hexlink.address,
            (await provider.getNetwork()).chainId,
            await hexlink.nonce(nameHash)
        ]
      )
    );
    return result;
};

export async function genDeployAuthProof(
    provider: Provider,
    nameHash: string,
    owner: string,
    data: string,
    genAuthProof: (request: {requestId: string}) => Promise<AuthProof>,
) : Promise<{ initData: string, proof: AuthProof }> {
    const initData = accountInterface().encodeFunctionData(
        "init", [owner, data]
    );
    const requestId = await genRequestId(
        provider,
        nameHash,
        hexlInterface().getSighash("deploy"),
        initData
    );
    return {
        initData,
        proof: await genAuthProof({requestId})
    };
}