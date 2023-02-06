import { ethers } from "ethers";

import type { Chain } from "../../functions/common";
import type { PriceInfo, PriceConfig } from "../../functions/common";
import { useWalletStore } from "@/stores/wallet";
import { useRedPacketStore } from "@/stores/redpacket";
import { useChainStore } from '@/stores/chain';
import { getFunctions, httpsCallable } from 'firebase/functions'

const ALCHEMY_KEY = {
    "goerli": "U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
    "polygon": "1GmfWOSlYIlUI0UcCu4Y2O-8DmFJrlqA",
    "mumbai": "Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
};

async function doSwitch(chain: Chain) {
    useRedPacketStore().reset();
    useChainStore().switchNetwork(chain);
}

export function alchemyKey(chain: Chain) : string {
    return (ALCHEMY_KEY as any)[chain.name] as string;
}

export async function switchNetwork(chain: Chain) {
    const currentChain = useChainStore().chain;
    if (chain.chainId == currentChain?.chainId) {
        return;
    }

    const connected = useWalletStore().connected;
    if (!currentChain || !connected || Number(chain.chainId) == window.ethereum.networkVersion) {
        doSwitch(chain);
        return;
    }

    if (connected) {
        const hexifyChainId = ethers.utils.hexValue(Number(chain.chainId));
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: hexifyChainId }],
            });
            doSwitch(chain);
        } catch (error: any) {
            if (error.code === 4902) {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: hexifyChainId,
                        chainName: chain.fullName,
                        blockExplorerUrls: [...chain.blockExplorerUrls],
                        nativeCurrency: {...chain.nativeCurrency},
                        rpcUrls: [...chain.rpcUrls],
                    }],
                });
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: hexifyChainId }],
                });
                doSwitch(chain);
            } else {
                console.log(error);
            }
        }
    }
}

export function getProvider(chain: Chain) {
    return new ethers.providers.AlchemyProvider(
        Number(chain!.chainId),
        alchemyKey(chain),
    );
}

export function getInfuraProvider(chain: Chain) {
    return new ethers.providers.InfuraProvider(
        Number(chain.chainId),
        import.meta.env.VITE_INFURA_API_KEY
    );
}

const functions = getFunctions();
const priceConfig : {
    value?: PriceConfig,
    updatedAt: number,
} = {updatedAt: new Date().getTime()};
async function getPriceConfig(chain: Chain) : Promise<PriceConfig> {
    //refresh every 15mins
    if (!priceConfig.value || priceConfig.updatedAt < new Date().getTime() - 900000) {
        const getPriceConfig = httpsCallable(functions, 'priceConfig');
        const result = await getPriceConfig({chain: chain.name});
        priceConfig.value = (result.data as any).priceConfig;
        priceConfig.updatedAt = new Date().getTime();
    }
    return priceConfig.value as PriceConfig;
}

export async function getPriceInfo(chain: Chain) : Promise<PriceInfo> {
    const priceInfo = useChainStore().priceInfos[chain.name];
    // refresh every 5s
    if (!priceInfo || priceInfo.updatedAt < new Date().getTime() - 5000) {
        const priceConfig = await getPriceConfig(chain);
        const feeData = await getInfuraProvider(chain).getFeeData();
        useChainStore().refreshPriceInfo(chain, {
            ...priceConfig,
            lastBaseFeePerGas: feeData.lastBaseFeePerGas?.toString() || "0",
            maxFeePerGas: feeData.maxFeePerGas?.toString() || "0",
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString() || "0",
            updatedAt: new Date().getTime()
        });
    }
    return useChainStore().priceInfos[chain.name];
}

export async function getRefunder(chain: Chain) : Promise<string> {
    const getRefunder = httpsCallable(functions, 'priceInfo');
    const result = await getRefunder({chain: chain.name});
    return (result.data as any).refunder as string;
}