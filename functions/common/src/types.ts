"use strict";

import {BigNumber as EthBigNumber} from "ethers";

export interface OpInput {
    to: string,
    value: EthBigNumber,
    callData: string | [],
    callGasLimit: EthBigNumber,
}

export interface Op {
  name: string;
  function: string;
  args: {[key: string]: any};
  input: OpInput;
}

export interface GasObject {
  receiver: string;
  token: string;
  base: EthBigNumber;
  price: EthBigNumber;
}

export interface Deposit {
  ref: string,
  receipt: string,
  token: string,
  amount: string,
}
