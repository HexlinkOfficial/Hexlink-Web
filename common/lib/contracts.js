"use strict";
import { ethers, Contract } from "ethers";
import ERC20_ABI from "./abi/ERC20_ABI.json";
export function erc20Interface() {
    return new ethers.utils.Interface(ERC20_ABI);
}
export function erc20Contract(provider, address) {
    return new ethers.Contract(address, ERC20_ABI, provider);
}
