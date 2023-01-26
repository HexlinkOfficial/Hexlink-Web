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
import { accountInterface } from "./account";
import { hexlContract, hexlInterface } from "./hexlink";
const genRequestId = function (provider, nameHash, func, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const hexlink = yield hexlContract(provider);
        const result = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["bytes4", "bytes", "address", "uint256", "uint256"], [
            func,
            data,
            hexlink.address,
            (yield provider.getNetwork()).chainId,
            yield hexlink.nonce(nameHash)
        ]));
        return result;
    });
};
export function genDeployAuthProof(provider, nameHash, owner, data, genAuthProof) {
    return __awaiter(this, void 0, void 0, function* () {
        const initData = accountInterface.encodeFunctionData("init", [owner, data]);
        const requestId = yield genRequestId(provider, nameHash, hexlInterface.getSighash("deploy"), initData);
        return {
            initData,
            proof: yield genAuthProof({ requestId })
        };
    });
}
