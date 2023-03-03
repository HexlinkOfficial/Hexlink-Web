"use strict";

import {ethers, Contract, BigNumber as EthBigNumber } from "ethers";
import type {Provider} from "@ethersproject/providers";
import ACCOUNT_SIMPLE_ABI from "./abi/ACCOUNT_SIMPLE_ABI.json";
import {hash, isContract} from "./utils";
import type {GasObject, OpInput} from "./types";
import type {TransactionReceipt} from "@ethersproject/providers";

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

export async function setAccountOwner(
    provider: Provider,
    account: Account
): Promise<Account> {
  const address = account.address;
  account.isContract = await isContract(provider, address);
  if (account.isContract) {
    const contract = accountContract(provider, address);
    account.owner = await contract.owner();
  }
  return account;
}

export function encodeInit(owner: string, data: string) {
  return accountInterface.encodeFunctionData(
    "init",
    [owner, data]
  );
}

export function encodeExec(op: OpInput) {
  return accountInterface.encodeFunctionData(
    "exec", [op]
  );
}

export function encodeExecBatch(ops: OpInput[]) {
  return accountInterface.encodeFunctionData(
    "execBatch", [ops]
  );
}

export async function encodeValidateAndCall(params: {
  nonce: EthBigNumber | string | number,
  txData: string
  sign: (msg: string) => Promise<string>,
  gas?: GasObject
}) : Promise<{data: string, signature: string}> {
  let data: string;
  if (params.gas) {
    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
          ["bytes", "uint256", "tuple(address, address, address, uint256)"],
          [params.txData, params.nonce, [
            params.gas.swapper,
            params.gas.token,
            params.gas.receiver,
            params.gas.baseGas,
          ]]
      )
    );
    const signature = await params.sign(message);
    data = accountInterface.encodeFunctionData(
      "validateAndCallWithGasRefund",
      [
        params.txData,
        params.nonce,
        params.gas,
        signature,
      ]
    );
    return { data, signature}
  } else {
    const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
          ["bytes", "uint256"],
          [params.txData, params.nonce]
      )
    );
    const signature = await params.sign(message);
    data = accountInterface.encodeFunctionData(
      "validateAndCall",
      [params.txData, params.nonce, signature]
    );
    return { data, signature}
  }
}