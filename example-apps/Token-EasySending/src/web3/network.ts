import { ethers, BigNumber as EthBigNumber } from "ethers";

import { isNativeCoin, isWrappedCoin } from "../../../../functions/common";
import type { Chain, BigNumberish } from "../../../../functions/common";
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