import { ethers, BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";

import type { Chain } from "@hexlink/hexlink";
import type { PriceInfo } from '@/types';
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
export async function getPriceInfo(chain: Chain) : Promise<PriceInfo> {
    const priceInfo = useChainStore().priceInfos[chain.name];
    // refresh every 15 mins
    if (!priceInfo || priceInfo.updatedAt < new Date().getTime() - 900000) {
        const getPriceInfo = httpsCallable(functions, 'priceInfo');
        const result = await getPriceInfo({chainId: chain.chainId});
        const info : {
            nativeCurrencyInUsd: string,
            gasPrice: string
        } = (result.data as any).priceInfo;
        useChainStore().refreshPriceInfo(chain, {
            nativeCurrencyInUsd: new BigNumber(info.nativeCurrencyInUsd),
            gasPrice: EthBigNumber.from(info.gasPrice),
            updatedAt: new Date().getTime()
        });
    }
    return useChainStore().priceInfos[chain.name];
}