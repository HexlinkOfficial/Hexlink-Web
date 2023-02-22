import { Chain } from "./chain";
import { isNativeCoin, isStableCoin, isWrappedCoin } from "./tokens";
import { BigNumber as EthBigNumber } from "ethers";

export async function calcGas(
    chain: Chain,
    gasToken: {
        address: string,
        decimals: number,
    },
    amount: EthBigNumber,
    price: {
        gasPrice: string | EthBigNumber,
        tokenPrice: string | EthBigNumber,
    }
) : Promise<EthBigNumber> {
    if (isNativeCoin(gasToken.address, chain) || isWrappedCoin(gasToken.address, chain)) {
        return amount.mul(price.gasPrice);
    } else if (isStableCoin(gasToken.address, chain)) {
        const base = EthBigNumber.from(10).pow(18);
        return amount.mul(price.gasPrice).mul(price.tokenPrice).div(base).add(1);
    }
    throw new Error("Unsupported gas token");
}