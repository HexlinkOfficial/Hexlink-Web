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
exports.tokenAmount = exports.tokenBase = exports.isStableCoin = exports.isWrappedCoin = exports.isNativeCoin = exports.getPopularTokens = exports.allowedGasToken = exports.stableCoinAddresses = exports.wrappedCoinAddress = exports.nativeCoinAddress = void 0;
const GOERLI_TOKENS_json_1 = __importDefault(require("./tokens/GOERLI_TOKENS.json"));
const MUMBAI_TOKENS_json_1 = __importDefault(require("./tokens/MUMBAI_TOKENS.json"));
const POLYGON_TOKENS_json_1 = __importDefault(require("./tokens/POLYGON_TOKENS.json"));
const addresses_json_1 = __importDefault(require("./addresses.json"));
const bignumber_js_1 = require("bignumber.js");
const utils_1 = require("./utils");
function nativeCoinAddress(chain) {
    return addresses_json_1.default[chain.name].nativeCoin.toLowerCase();
}
exports.nativeCoinAddress = nativeCoinAddress;
function wrappedCoinAddress(chain) {
    return addresses_json_1.default[chain.name].wrappedCoin.toLowerCase();
}
exports.wrappedCoinAddress = wrappedCoinAddress;
function stableCoinAddresses(chain) {
    return addresses_json_1.default[chain.name].stableCoins.map((a) => a.toLowerCase());
}
exports.stableCoinAddresses = stableCoinAddresses;
function allowedGasToken(chain) {
    return [
        nativeCoinAddress(chain),
        wrappedCoinAddress(chain),
        ...stableCoinAddresses(chain),
    ];
}
exports.allowedGasToken = allowedGasToken;
// const POLYGON_POPULAR_TOKENS = "https://api-polygon-tokens.polygon.technology/tokenlists/popularTokens.tokenlist.json";
function getPopularTokens(chain) {
    return __awaiter(this, void 0, void 0, function* () {
        if (chain.chainId == "137") {
            // const response = await fetch(POLYGON_POPULAR_TOKENS);
            // return await response.json();
            return {
                timestamp: new Date().toISOString(),
                tokens: POLYGON_TOKENS_json_1.default,
            };
        }
        if (chain.chainId == "5") {
            return {
                timestamp: new Date().toISOString(),
                tokens: GOERLI_TOKENS_json_1.default,
            };
        }
        if (chain.chainId == "80001") {
            return {
                timestamp: new Date().toISOString(),
                tokens: MUMBAI_TOKENS_json_1.default,
            };
        }
        return {
            tokens: [],
            timestamp: new Date().toDateString(),
            error: "Unsupported network " + chain.chainId,
        };
    });
}
exports.getPopularTokens = getPopularTokens;
function isNativeCoin(token, chain) {
    return token.address == nativeCoinAddress(chain);
}
exports.isNativeCoin = isNativeCoin;
function isWrappedCoin(token, chain) {
    return token.address == wrappedCoinAddress(chain);
}
exports.isWrappedCoin = isWrappedCoin;
function isStableCoin(token, chain) {
    return stableCoinAddresses(chain).includes(token.address);
}
exports.isStableCoin = isStableCoin;
function tokenBase(token) {
    return new bignumber_js_1.BigNumber(10).pow(token.decimals);
}
exports.tokenBase = tokenBase;
function tokenAmount(balance, token) {
    return (0, utils_1.toEthBigNumber)(tokenBase(token).times(balance));
}
exports.tokenAmount = tokenAmount;
