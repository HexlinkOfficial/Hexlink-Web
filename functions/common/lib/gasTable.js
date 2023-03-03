"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGasCost = exports.ACTION_TO_GAS_COST = void 0;
exports.ACTION_TO_GAS_COST = {
    "default": {
        "claim_erc20_redpacket": 150000,
        "claim_erc721_redpacket": 200000,
        "deploy": 200000,
    },
    "arbitrum": {
        "claim_erc20_redpacket": 1600000,
        "claim_erc721_redpacket": 1500000,
        "deploy": 1200000,
    },
};
function getGasCost(chain, action) {
    if (exports.ACTION_TO_GAS_COST[chain.name]) {
        return exports.ACTION_TO_GAS_COST[chain.name][action] || 0;
    }
    return exports.ACTION_TO_GAS_COST["default"][action] || 0;
}
exports.getGasCost = getGasCost;
