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
exports.redPacketContract = exports.redPacketAddress = exports.redPacketInterface = void 0;
const ethers_1 = require("ethers");
const common_1 = require("../../common");
const HAPPY_RED_PACKET_ABI_json_1 = __importDefault(require("./abi/HAPPY_RED_PACKET_ABI.json"));
const addresses_json_1 = __importDefault(require("./addresses.json"));
exports.redPacketInterface = new ethers_1.ethers.utils.Interface(HAPPY_RED_PACKET_ABI_json_1.default);
function redPacketAddress(chain) {
    return addresses_json_1.default[chain.name];
}
exports.redPacketAddress = redPacketAddress;
function redPacketContract(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        return new ethers_1.ethers.Contract(redPacketAddress(yield (0, common_1.getChainFromProvider)(provider)), HAPPY_RED_PACKET_ABI_json_1.default, provider);
    });
}
exports.redPacketContract = redPacketContract;
