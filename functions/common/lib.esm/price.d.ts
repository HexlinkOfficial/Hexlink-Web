import { Chain } from "./chain";
import { BigNumber as EthBigNumber } from "ethers";
export declare function calcGas(chain: Chain, gasToken: {
    address: string;
    decimals: number;
}, amount: EthBigNumber, price: {
    gasPrice: string | EthBigNumber;
    tokenPrice: string | EthBigNumber;
}): Promise<EthBigNumber>;
