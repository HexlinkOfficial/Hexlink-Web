import { isNativeCoin, isStableCoin, isWrappedCoin } from "./tokens";
import { BigNumber as EthBigNumber } from "ethers";
export async function calcGas(chain, gasToken, amount, price) {
    if (isNativeCoin(gasToken.address, chain) || isWrappedCoin(gasToken.address, chain)) {
        return amount.mul(price.gasPrice);
    }
    else if (isStableCoin(gasToken.address, chain)) {
        const base = EthBigNumber.from(10).pow(18);
        return amount.mul(price.gasPrice).mul(price.tokenPrice).div(base).add(1);
    }
    throw new Error("Unsupported gas token");
}
