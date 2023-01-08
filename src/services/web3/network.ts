import type { Network } from '@/types';
import { ethers } from "ethers";
import { useWalletStore } from "@/stores/wallet";
import { Alchemy, Network as AlchemyNetwork } from "alchemy-sdk";
import { initProfile } from "@/services/web3/account";
import { updateProfileBalances } from "@/services/web3/tokens";
import { useViewStore } from '@/stores/view';
import { useNetworkStore } from '@/stores/network';

async function doSwitch(network: Network) {
    useNetworkStore().switchNetwork(network);
    const view = useViewStore();
    view.setLoading(true);
    await initProfile();
    await updateProfileBalances();
    view.setLoading(false);
}

export async function switchNetwork(network: Network) {
    if (network.chainId == useNetworkStore().network.chainId) {
        return;
    }

    if (!useWalletStore().connected || network.chainId == Number(window.ethereum.networkVersion)) {
        doSwitch(network);
        return;
    }

    if (useWalletStore().connected) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.utils.hexValue(network.chainId) }],
            });
            doSwitch(network);
        } catch (error: any) {
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
                doSwitch(network);
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
    if (network.chainId == 80001) {
        return AlchemyNetwork.MATIC_MUMBAI;
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