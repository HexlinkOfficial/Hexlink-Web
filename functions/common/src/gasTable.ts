import type { BigNumberish } from "./types";
import type { Chain } from './chain';

export const ACTION_TO_GAS_COST : {
    [key: string]: {
        [key: string]: BigNumberish
    }
} = {
    "default": {
        "claim_erc20_redpacket": 150000,
        "claim_erc721_redpacket": 200000,
        "deploy": 250000,
    },
    "arbitrum": {
        "claim_erc20_redpacket": 1600000,
        "claim_erc721_redpacket": 1500000,
        "deploy": 1200000,
    },
}

export function getGasCost(chain: Chain, action: string) : BigNumberish {
    if (ACTION_TO_GAS_COST[chain.name]) {
        return ACTION_TO_GAS_COST[chain.name][action] || 0;
    }
    return ACTION_TO_GAS_COST["default"][action] || 0;
}
