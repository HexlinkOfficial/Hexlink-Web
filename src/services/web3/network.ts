import type { Network } from '@/types';
import { ethers } from "ethers";
import { useWalletStore } from '@/stores/wallet';
import { useNetworkStore } from '@/stores/network';
import { Alchemy, Network as AlchemyNetwork } from "alchemy-sdk";

export async function switchNewtwork(network: Network) {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(network.chainId) }],
        });
        useWalletStore().wallet!.network = network.name;
    } catch (error: any) {
        if (error.code === 4902) {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [network],
            });
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.utils.hexValue(network.chainId) }],
            });
            useWalletStore().wallet!.network = network.name;
        } else {
            console.log(error);
        }
    }
}

export function alchemyNetwork(network: Network) : AlchemyNetwork {
    if (network.chainId == 5) {
        return AlchemyNetwork.ETH_GOERLI;
    }
    if (network.chainId == 137) {
        return AlchemyNetwork.MATIC_MAINNET;
    }
    throw new Error("Unsupported network");
}

export function alchemyKey(network: Network) {
    const keys = JSON.parse(import.meta.env.VITE_ALCHEMY_KEY);
    return keys[network.name];
}

export function alchemy() {
    const network = useNetworkStore().network;
    return new Alchemy({
        apiKey: alchemyKey(network),
        network: alchemyNetwork(network)
    });
}

export function getProvider() {
    const network = useNetworkStore().network;
    return new ethers.providers.AlchemyProvider(
        network.chainId,
        alchemyKey(network)
    );
}