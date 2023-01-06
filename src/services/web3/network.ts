import type { Network } from '@/types';
import { ethers } from "ethers";
import type { Provider } from "@ethersproject/providers"

export async function switchNewtwork(network: Network) {
    try {
        await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.utils.hexValue(network.chainId) }],
        });
    } catch (error: any) {
        if (error.code === 4902) {
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [network],
        });
        } else {
        console.log(error);
        }
    }
}

let provider: Provider | null = null;
export function getProvider() {
    if (!provider) {
        provider = new ethers.providers.AlchemyProvider(
            "goerli",
            import.meta.env.VITE_GOERLI_ALCHEMY_KEY
        );
    }
    return provider;
}