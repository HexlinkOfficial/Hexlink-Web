export const ACTION_TO_GAS_COST = {
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
export function getGasCost(chain, action) {
    if (ACTION_TO_GAS_COST[chain.name]) {
        return ACTION_TO_GAS_COST[chain.name][action] || 0;
    }
    return ACTION_TO_GAS_COST["default"][action] || 0;
}
