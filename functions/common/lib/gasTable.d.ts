import type { BigNumberish } from "./types";
import type { Chain } from './chain';
export declare const ACTION_TO_GAS_COST: {
    [key: string]: {
        [key: string]: BigNumberish;
    };
};
export declare function getGasCost(chain: Chain, action: string): BigNumberish;
