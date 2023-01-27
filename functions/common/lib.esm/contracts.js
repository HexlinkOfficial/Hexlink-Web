/* eslint-disable require-jsdoc */
"use strict";
import { ethers } from "ethers";
import ERC20_ABI from "./abi/ERC20_ABI.json";
export const erc20Interface = new ethers.utils.Interface(ERC20_ABI);
export function erc20Contract(provider, address) {
    return new ethers.Contract(address, ERC20_ABI, provider);
}
