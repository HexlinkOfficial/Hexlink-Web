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
exports.genDeployAuthProof = exports.genRequestId = exports.buildAccountInitData = void 0;
const ethers_1 = require("ethers");
const account_1 = require("./account");
const hexlink_1 = require("./hexlink");
const buildAccountInitData = (owner) => __awaiter(void 0, void 0, void 0, function* () {
    return account_1.accountInterface.encodeFunctionData("init", [owner]);
});
exports.buildAccountInitData = buildAccountInitData;
const genRequestId = function (provider, owner, func) {
    return __awaiter(this, void 0, void 0, function* () {
        const hexlink = yield (0, hexlink_1.hexlContract)(provider);
        const data = (0, exports.buildAccountInitData)(owner);
        const requestId = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes4", "address", "uint256", "bytes"], [
            func,
            hexlink.address,
            (yield provider.getNetwork()).chainId,
            data
        ]));
        return requestId;
    });
};
exports.genRequestId = genRequestId;
function genDeployAuthProof(provider, owner, genAuthProof) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestId = yield (0, exports.genRequestId)(provider, owner, hexlink_1.hexlInterface.getSighash("deploy"));
        return {
            proof: yield genAuthProof({ requestId }),
        };
    });
}
exports.genDeployAuthProof = genDeployAuthProof;
