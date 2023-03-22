import { ethers, BigNumber as EthBigNumber } from "ethers";

import { isNativeCoin, isWrappedCoin } from "../../../functions/common";
import type { Chain, BigNumberish } from "../../../functions/common";
import { hexlinkSwap } from "../../../functions/redpacket";
import { useRedPacketStore } from "@/stores/redpacket";
import { useStatusStore } from "@/stores/airdropStatus";
import { useChainStore } from '@/stores/chain';

const ALCHEMY_KEY = {
    "goerli": "U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
    "polygon": "1GmfWOSlYIlUI0UcCu4Y2O-8DmFJrlqA",
    "mumbai": "Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
    "arbitrum_testnet": "ePtF_3xEZX-VJoFXnfiu5b_Tt0-bTcx6",
    "arbitrum": "Lw4de41huTiNuyyOvyzs_s5jTbCDg1yx",
};

async function doSwitch(chain: Chain) {
    useRedPacketStore().reset();
    useStatusStore().reset();
    useChainStore().switchNetwork(chain);
}

export function alchemyKey(chain: Chain) : string {
    return (ALCHEMY_KEY as any)[chain.name] as string;
}

export async function switchNetwork(chain: Chain) {
    if (chain.name === useChainStore().chain?.name) {
        return;
    }
    doSwitch(chain);
}

export function getProvider(chain: Chain) {
    if (chain.name === "arbitrum_nova") {
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

export async function getPriceInfo(chain: Chain, gasToken: string) : Promise<{
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
        const {maxFeePerGas} = await provider.getFeeData();
        if (!maxFeePerGas) {
            throw new Error("failed to get the gas price");
        }
        gasPrice = maxFeePerGas.mul(2);
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