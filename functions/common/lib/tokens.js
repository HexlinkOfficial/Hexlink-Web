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
exports.tokenAmount = exports.tokenBase = exports.gasTokenDecimals = exports.isAllowedGasToken = exports.isStableCoin = exports.isWrappedCoin = exports.isNativeCoin = exports.getPopularTokens = exports.allowedGasToken = exports.stableCoinAddresses = exports.wrappedCoinAddress = exports.nativeCoinAddress = exports.stableCoins = exports.wrappedCoin = exports.nativeCoin = void 0;
const SEPOLIA_TOKENS_json_1 = __importDefault(require("./tokens/SEPOLIA_TOKENS.json"));
const GOERLI_TOKENS_json_1 = __importDefault(require("./tokens/GOERLI_TOKENS.json"));
const MUMBAI_TOKENS_json_1 = __importDefault(require("./tokens/MUMBAI_TOKENS.json"));
const POLYGON_TOKENS_json_1 = __importDefault(require("./tokens/POLYGON_TOKENS.json"));
const ARBITRUM_TOKENS_json_1 = __importDefault(require("./tokens/ARBITRUM_TOKENS.json"));
const ARBITRUM_TESTNET_TOKENS_json_1 = __importDefault(require("./tokens/ARBITRUM_TESTNET_TOKENS.json"));
const ARBITRUM_NOVA_TOKENS_json_1 = __importDefault(require("./tokens/ARBITRUM_NOVA_TOKENS.json"));
const OKCHAIN_TESTNET_TOKENS_json_1 = __importDefault(require("./tokens/OKCHAIN_TESTNET_TOKENS.json"));
const addresses_json_1 = __importDefault(require("./addresses.json"));
const bignumber_js_1 = require("bignumber.js");
const utils_1 = require("./utils");
function nativeCoin(chain) {
    return addresses_json_1.default[chain.name].nativeCoin;
}
exports.nativeCoin = nativeCoin;
function wrappedCoin(chain) {
    return addresses_json_1.default[chain.name].wrappedCoin;
}
exports.wrappedCoin = wrappedCoin;
function stableCoins(chain) {
    return addresses_json_1.default[chain.name].stableCoins;
}
exports.stableCoins = stableCoins;
function nativeCoinAddress(chain) {
    return nativeCoin(chain).address.toLowerCase();
}
exports.nativeCoinAddress = nativeCoinAddress;
function wrappedCoinAddress(chain) {
    var _a;
    return (_a = wrappedCoin(chain)) === null || _a === void 0 ? void 0 : _a.address.toLowerCase();
}
exports.wrappedCoinAddress = wrappedCoinAddress;
function stableCoinAddresses(chain) {
    return stableCoins(chain).map(a => a.address.toLowerCase());
}
exports.stableCoinAddresses = stableCoinAddresses;
function allowedGasToken(chain) {
    const wrapped = wrappedCoinAddress(chain);
    return [
        nativeCoinAddress(chain),
        ...stableCoinAddresses(chain),
    ].concat(wrapped ? [wrapped] : []);
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
        if (chain.chainId == "11155111") {
            return {
                timestamp: new Date().toISOString(),
                tokens: SEPOLIA_TOKENS_json_1.default,
            };
        }
        if (chain.chainId == "80001") {
            return {
                timestamp: new Date().toISOString(),
                tokens: MUMBAI_TOKENS_json_1.default,
            };
        }
        if (chain.chainId == "421613") {
            return {
                timestamp: new Date().toISOString(),
                tokens: ARBITRUM_TESTNET_TOKENS_json_1.default,
            };
        }
        if (chain.chainId == "42170") {
            return {
                timestamp: new Date().toISOString(),
                tokens: ARBITRUM_NOVA_TOKENS_json_1.default,
            };
        }
        if (chain.chainId == "42161") {
            return {
                timestamp: new Date().toISOString(),
                tokens: ARBITRUM_TOKENS_json_1.default,
            };
        }
        if (chain.chainId == "65") {
            return {
                timestamp: new Date().toISOString(),
                tokens: OKCHAIN_TESTNET_TOKENS_json_1.default,
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
function equal(a, b) {
    return a.toLowerCase() == b.toLowerCase();
}
function isNativeCoin(token, chain) {
    return equal(token, nativeCoinAddress(chain));
}
exports.isNativeCoin = isNativeCoin;
function isWrappedCoin(token, chain) {
    const wrapped = wrappedCoinAddress(chain);
    if (!wrapped) {
        return false;
    }
    return equal(token, wrapped);
}
exports.isWrappedCoin = isWrappedCoin;
function isStableCoin(token, chain) {
    return stableCoinAddresses(chain).includes(token.toLowerCase());
}
exports.isStableCoin = isStableCoin;
function isAllowedGasToken(token, chain) {
    return isNativeCoin(token, chain) ||
        isWrappedCoin(token, chain) ||
        isStableCoin(token, chain);
}
exports.isAllowedGasToken = isAllowedGasToken;
function gasTokenDecimals(token, chain) {
    var _a;
    if (isNativeCoin(token, chain)) {
        return nativeCoin(chain).decimals;
    }
    if (isWrappedCoin(token, chain)) {
        return wrappedCoin(chain).decimals;
    }
    if (isStableCoin(token, chain)) {
        return (_a = stableCoins(chain).find(c => c.address.toLowerCase() === token.toLowerCase())) === null || _a === void 0 ? void 0 : _a.decimals;
    }
}
exports.gasTokenDecimals = gasTokenDecimals;
function tokenBase(token) {
    return new bignumber_js_1.BigNumber(10).pow(token.decimals);
}
exports.tokenBase = tokenBase;
function tokenAmount(balance, decimals) {
    return (0, utils_1.toEthBigNumber)(new bignumber_js_1.BigNumber(10).pow(decimals).times(balance));
}
exports.tokenAmount = tokenAmount;
