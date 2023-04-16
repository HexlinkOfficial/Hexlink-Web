"use strict";

import type {Provider} from "@ethersproject/providers";
import {ethers} from "ethers";
import {accountInterface} from "./account";
import {hexlContract, hexlInterface} from "./hexlink";
import type {AuthProof} from "./types";

export const buildAccountInitData = async (owner: string) => {
  return accountInterface.encodeFunctionData("init", [owner]);
}

export const genRequestId = async function(
    provider: Provider,
    owner: string,
    func: string
) {
  const hexlink = await hexlContract(provider);
  const data = buildAccountInitData(owner);
  const requestId = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes4", "address", "uint256", "bytes"],
      [
        func,
        hexlink.address,
        (await provider.getNetwork()).chainId,
        data
      ]
    )
  );
  return requestId;
};

export async function genDeployAuthProof(
    provider: Provider,
    owner: string,
    genAuthProof: (
      request: {requestId: string}
    ) => Promise<string>
) : Promise<{ proof: string }> {
  const requestId = await genRequestId(
      provider,
      owner,
      hexlInterface.getSighash("deploy")
  );
  return {
    proof: await genAuthProof({requestId}),
  };
}
