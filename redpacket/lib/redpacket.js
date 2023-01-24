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
import { getChainFromProvider } from "../../common";
import RED_PACKET_ABI from "./HAPPY_RED_PACKET_ABI.json";
import ADDRESSES from "./addresses.json";
export const redPacketInterface = new ethers.utils.Interface(RED_PACKET_ABI);
export function redPacketAddress(chain) {
    return ADDRESSES[chain.name];
}
export function redPacketContract(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        return new ethers.Contract(redPacketAddress(yield getChainFromProvider(provider)), RED_PACKET_ABI, provider);
    });
}
