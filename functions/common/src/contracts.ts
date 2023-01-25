/* eslint-disable require-jsdoc */
"use strict";

import {ethers, Contract} from "ethers";
import type {Provider} from "@ethersproject/providers";
import ERC20_ABI from "./abi/ERC20_ABI.json";

export const erc20Interface = new ethers.utils.Interface(ERC20_ABI);

export function erc20Contract(provider: Provider, address: string) : Contract {
  return new ethers.Contract(
      address,
      ERC20_ABI,
      provider
  );
}