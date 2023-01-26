"use strict";

import {ethers, Contract, BigNumber as EthBigNumber } from "ethers";
import type {Provider} from "@ethersproject/providers";
import ACCOUNT_SIMPLE_ABI from "./abi/ACCOUNT_SIMPLE_ABI.json";
import {hash, isContract} from "./utils";
import {GasObject, UserOpInput} from "./types";

export interface Account {
    address: string,
    isContract: boolean,
    owner?: string,
}

export const accountInterface = new ethers.utils.Interface(ACCOUNT_SIMPLE_ABI);

export function nameHash(schema: string, name: string) {
  return hash(`${schema}:${name}`);
}

export function accountContract(provider: Provider, address: string): Contract {
  return new ethers.Contract(
      address,
      ACCOUNT_SIMPLE_ABI,
      provider
  );
}

export async function hexlAccount(
    provider: Provider,
    hexlink: Contract,
    nameHash: string
): Promise<Account> {
  const address = await hexlink.addressOfName(nameHash);
  const acc = {
    address,
    isContract: await isContract(provider, address),
  } as Account;
  if (acc.isContract) {
    const contract = accountContract(provider, address);
    acc.owner = await contract.owner();
  }
  return acc;
}

export function encodeInit(owner: string, data: string) {
  return accountInterface.encodeFunctionData(
    "init",
    [owner, data]
  );
}

export function encodeExec(op: UserOpInput) {
  return accountInterface.encodeFunctionData(
    "execBatch", [op]
  );
}

export function encodeExecBatch(ops: UserOpInput[]) {
  return accountInterface.encodeFunctionData(
    "execBatch", [ops]
  );
}

export function encodeValidateAndCall(params: {
  ops: UserOpInput[],
  signature: string,
  nonce: EthBigNumber,
  gas?: GasObject
}) {
  const txData = encodeExecBatch(params.ops);
  if (params.gas) {
    return accountInterface.encodeFunctionData(
      "validateAndCall",
      [txData, params.nonce, params.signature]
    );
  } else {
    return accountInterface.encodeFunctionData(
      "validateAndCallWithGasRefund",
      [txData, params.nonce, params.signature, params.gas]
    );
  }
}