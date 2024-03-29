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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeValidateAndCall = exports.encodeExecBatch = exports.encodeExec = exports.encodeInit = exports.setAccountOwner = exports.hexlAccount = exports.accountContract = exports.nameHash = exports.accountInterface = void 0;
const ethers_1 = require("ethers");
const ACCOUNT_SIMPLE_ABI_json_1 = __importDefault(require("./abi/ACCOUNT_SIMPLE_ABI.json"));
const utils_1 = require("./utils");
exports.accountInterface = new ethers_1.ethers.utils.Interface(ACCOUNT_SIMPLE_ABI_json_1.default);
function nameHash(schema, name) {
    if (schema === "mailto") {
        name = name.trim().toLowerCase();
    }
    return (0, utils_1.hash)(`${schema}:${name}`);
}
exports.nameHash = nameHash;
function accountContract(provider, address) {
    return new ethers_1.ethers.Contract(address, ACCOUNT_SIMPLE_ABI_json_1.default, provider);
}
exports.accountContract = accountContract;
function hexlAccount(provider, hexlink, nameHash) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = yield hexlink.addressOfName(nameHash);
        const acc = {
            address,
            isContract: yield (0, utils_1.isContract)(provider, address),
        };
        if (acc.isContract) {
            const contract = accountContract(provider, address);
            acc.owner = yield contract.owner();
        }
        return acc;
    });
}
exports.hexlAccount = hexlAccount;
function setAccountOwner(provider, account) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = account.address;
        account.isContract = yield (0, utils_1.isContract)(provider, address);
        if (account.isContract) {
            const contract = accountContract(provider, address);
            account.owner = yield contract.owner();
        }
        return account;
    });
}
exports.setAccountOwner = setAccountOwner;
function encodeInit(owner, data) {
    return exports.accountInterface.encodeFunctionData("init", [owner, data]);
}
exports.encodeInit = encodeInit;
function encodeExec(op) {
    return exports.accountInterface.encodeFunctionData("exec", [op]);
}
exports.encodeExec = encodeExec;
function encodeExecBatch(ops) {
    return exports.accountInterface.encodeFunctionData("execBatch", [ops]);
}
exports.encodeExecBatch = encodeExecBatch;
function encodeValidateAndCall(params) {
    return __awaiter(this, void 0, void 0, function* () {
        let data;
        if (params.gas) {
            const message = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes", "uint256", "tuple(address, address, address, uint256)"], [params.txData, params.nonce, [
                    params.gas.swapper,
                    params.gas.token,
                    params.gas.receiver,
                    params.gas.baseGas,
                ]]));
            const signature = yield params.sign(message);
            data = exports.accountInterface.encodeFunctionData("validateAndCallWithGasRefund", [
                params.txData,
                params.nonce,
                params.gas,
                signature,
            ]);
            return { data, signature };
        }
        else {
            const message = ethers_1.ethers.utils.keccak256(ethers_1.ethers.utils.defaultAbiCoder.encode(["bytes", "uint256"], [params.txData, params.nonce]));
            const signature = yield params.sign(message);
            data = exports.accountInterface.encodeFunctionData("validateAndCall", [params.txData, params.nonce, signature]);
            return { data, signature };
        }
    });
}
exports.encodeValidateAndCall = encodeValidateAndCall;
