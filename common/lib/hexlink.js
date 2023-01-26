"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from "ethers";
import HEXLINK_ABI from "./abi/HEXLINK_ABI.json";
import ADDRESSES from "./addresses.json";
import { getChainFromProvider } from "./chain";
export const hexlInterface = new ethers.utils.Interface(HEXLINK_ABI);
export function hexlAddress(chain) {
    return ADDRESSES[chain.name].hexlink;
}
export function hexlContract(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        return new ethers.Contract(hexlAddress(yield getChainFromProvider(provider)), HEXLINK_ABI, provider);
    });
}
