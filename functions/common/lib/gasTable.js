"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGasCost = exports.ACTION_TO_GAS_COST = void 0;
exports.ACTION_TO_GAS_COST = {
    "default": {
        "claim_erc20_redpacket": 300000,
        "claim_erc721_redpacket": 300000,
        "deploy": 250000,
    },
    "arbitrum_testnet": {
        "claim_erc20_redpacket": 3000000,
        "claim_erc721_redpacket": 3000000,
        "deploy": 2500000,
    },
    "arbitrum": {
        "claim_erc20_redpacket": 3000000,
        "claim_erc721_redpacket": 3000000,
        "deploy": 2500000,
    },
};
function getGasCost(chain, action) {
    if (exports.ACTION_TO_GAS_COST[chain.name]) {
        return exports.ACTION_TO_GAS_COST[chain.name][action] || 0;
    }
    return exports.ACTION_TO_GAS_COST["default"][action] || 0;
}
exports.getGasCost = getGasCost;
