import { ethers, BigNumber as EthBigNumber } from "ethers";

import { isNativeCoin, isWrappedCoin } from "../../../../functions/common";
import type { Chain, BigNumberish } from "../../../../functions/common";
import { useChainStore } from '@/stores/chain';

const ALCHEMY_KEY = {
    "goerli": "U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
    "sepolia": "bxD5Q_FaAC26oV36IKd1px7WYm1WBo0Q",
    "polygon": "1GmfWOSlYIlUI0UcCu4Y2O-8DmFJrlqA",
    "mumbai": "Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
    "arbitrum_testnet": "ePtF_3xEZX-VJoFXnfiu5b_Tt0-bTcx6",
};

export function alchemyKey(chain: Chain) : string {
    return (ALCHEMY_KEY as any)[chain.name] as string;
}

export async function switchNetwork(chain: Chain) {
    if (chain.name === useChainStore().chain?.name) {
        return;
    }
    useChainStore().switchNetwork(chain);
}

export function getProvider(chain: Chain) {
    if (chain.name === "arbitrum_nova" || chain.name === "OKT") {
        return new ethers.providers.JsonRpcProvider(
            {url: chain.rpcUrls[0]}
        );
    } else {
        return new ethers.providers.InfuraProvider(
            Number(chain.chainId),
            import.meta.env.VITE_INFURA_API_KEY
        );
    }
}

export async function getPriceInfo(
    chain: Chain,
    maxFeePerGas: EthBigNumber | null,
    gasToken: string
) : Promise<{
    gasPrice: BigNumberish,
    tokenPrice: BigNumberish
}> {
    const provider = getProvider(chain);
    let gasPrice : EthBigNumber;
    if (chain.name === 'arbitrum' || chain.name === 'arbitrum_testnet') {
        gasPrice = EthBigNumber.from(100000000);
    } else if (chain.name === 'arbitrum_nova') {
        gasPrice = EthBigNumber.from(10000000);
    } else {
        gasPrice = EthBigNumber.from(maxFeePerGas ?? 0);
    }
    let tokenPrice;
    if (isNativeCoin(gasToken, chain) || isWrappedCoin(gasToken, chain)) {
        tokenPrice = EthBigNumber.from(10).pow(18);
    } else {
        const swap = await hexlinkSwap(provider);
        tokenPrice = await swap.priceOf(gasToken);
    }
    return {gasPrice, tokenPrice}
}