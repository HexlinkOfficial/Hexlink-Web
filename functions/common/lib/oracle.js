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
Object.defineProperty(exports, "__esModule", { value: true });
exports.genDeployAuthProof = void 0;
const ethers_1 = require("ethers");
const account_1 = require("./account");
const hexlink_1 = require("./hexlink");
const genRequestId = function (provider, nameHash, func, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const hexlink = yield (0, hexlink_1.hexlContract)(provider);
        const result = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes4", "bytes", "address", "uint256", "uint256"], [
            func,
            data,
            hexlink.address,
            (yield provider.getNetwork()).chainId,
            yield hexlink.nonce(nameHash),
        ]));
        return result;
    });
};
function genDeployAuthProof(provider, nameHash, owner, data, genAuthProof, version) {
    return __awaiter(this, void 0, void 0, function* () {
        const initData = account_1.accountInterface.encodeFunctionData("init", [owner, data]);
        const requestId = yield genRequestId(provider, nameHash, hexlink_1.hexlInterface.getSighash("deploy"), initData);
        return {
            initData,
            proof: yield genAuthProof({ requestId, version }),
        };
    });
}
exports.genDeployAuthProof = genDeployAuthProof;
