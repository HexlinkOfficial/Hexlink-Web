import { Chain } from "./chain";
import type { BigNumberish } from "./types";
import { BigNumber as EthBigNumber } from "ethers";
export declare function calcGas(chain: Chain, gasToken: {
    address: string;
    decimals: number;
}, amount: EthBigNumber, price: {
    gasPrice: BigNumberish;
    tokenPrice: BigNumberish;
}): EthBigNumber;
