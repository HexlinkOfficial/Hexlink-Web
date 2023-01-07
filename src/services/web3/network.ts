import type { Network } from '@/types';
import { ethers } from "ethers";
import { useWalletStore } from "@/stores/wallet";
import { useNetworkStore } from '@/stores/network';
import { Alchemy, Network as AlchemyNetwork } from "alchemy-sdk";

export async function switchNetwork(network: Network) {
    useNetworkStore().switchNetwork(network);
    if (useWalletStore().connected &&
        network.chainId != Number(window.ethereum.networkVersion)) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.utils.hexValue(network.chainId) }],
            });
        } catch (error: any) {
            console.log(error);
            if (error.code === 4902) {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: ethers.utils.hexValue(network.chainId),
                        chainName: network.chainName,
                        blockExplorerUrls: [...network.blockExplorerUrls],
                        nativeCurrency: {...network.nativeCurrency},
                        rpcUrls: [...network.rpcUrls],
                    }],
                });
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ethers.utils.hexValue(network.chainId) }],
                });
            } else {
                console.log(error);
            }
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

export function alchemy() {
    const network = useNetworkStore().network;
    return new Alchemy({
        apiKey: network.alchemy.key,
        network: alchemyNetwork(network)
    });
}

export function getProvider() {
    const network = useNetworkStore().network;
    return new ethers.providers.AlchemyProvider(
        network.chainId,
        network.alchemy.key
    );
}