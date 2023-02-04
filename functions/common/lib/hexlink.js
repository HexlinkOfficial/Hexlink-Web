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
exports.hexlContract = exports.hexlAddress = exports.hexlInterface = void 0;
const ethers_1 = require("ethers");
const HEXLINK_ABI_json_1 = __importDefault(require("./abi/HEXLINK_ABI.json"));
const addresses_json_1 = __importDefault(require("./addresses.json"));
const chain_1 = require("./chain");
exports.hexlInterface = new ethers_1.ethers.utils.Interface(HEXLINK_ABI_json_1.default);
function hexlAddress(chain) {
    return addresses_json_1.default[chain.name].hexlink;
}
exports.hexlAddress = hexlAddress;
function hexlContract(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const address = hexlAddress(yield (0, chain_1.getChainFromProvider)(provider));
        const contract = new ethers_1.ethers.Contract(address, HEXLINK_ABI_json_1.default, provider);
        return contract;
    });
}
exports.hexlContract = hexlContract;
