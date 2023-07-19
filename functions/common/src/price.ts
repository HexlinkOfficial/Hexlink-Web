import { Chain } from "./chain";
import type { BigNumberish } from "./types";
import { isNativeCoin, isStableCoin, isWrappedCoin, isStackupCoin } from "./tokens";
import { BigNumber as EthBigNumber } from "ethers";

export function calcGas(
    chain: Chain,
    gasToken: {
        address: string,
        decimals: number,
    },
    amount: EthBigNumber,
    price: {
        gasPrice: BigNumberish,
        tokenPrice: BigNumberish,
    }
) : EthBigNumber {
    if (isNativeCoin(gasToken.address, chain) || isWrappedCoin(gasToken.address, chain)) {
        return amount.mul(price.gasPrice);
    } else if (isStableCoin(gasToken.address, chain) || isStackupCoin(gasToken.address, chain)) {
        const base = EthBigNumber.from(10).pow(gasToken.decimals);
        return amount.mul(price.gasPrice).mul(price.tokenPrice).div(base).add(1);
    }
    throw new Error("Unsupported gas token");
}