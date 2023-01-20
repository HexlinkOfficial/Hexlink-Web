import { ethers, BigNumber as EthBigNumber } from "ethers";
import { BigNumber } from "bignumber.js";
import { Alchemy, Network as AlchemyNetwork } from "alchemy-sdk";

import type { Network, PriceInfo } from '@/types';
import { useWalletStore } from "@/stores/wallet";
import { useRedPacketStore } from "@/stores/redpacket";
import { initProfile } from "@/web3/account";
import { useNetworkStore } from '@/stores/network';
import { getFunctions, httpsCallable } from 'firebase/functions'

async function doSwitch(network: Network) {
    await initProfile(network);
    useRedPacketStore().reset();
    useNetworkStore().switchNetwork(network);
}

export async function switchNetwork(network: Network) {
    const currentNetwork = useNetworkStore().network;
    if (network.chainId == currentNetwork?.chainId) {
        return;
    }

    if (!currentNetwork || !useWalletStore().connected
        || Number(network.chainId) == window.ethereum.networkVersion) {
        doSwitch(network);
        return;
    }

    if (useWalletStore().connected) {
        const hexifyChainId = ethers.utils.hexValue(Number(network.chainId));
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: hexifyChainId }],
            });
            doSwitch(network);
        } catch (error: any) {
            if (error.code === 4902) {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId: hexifyChainId,
                        chainName: network.chainName,
                        blockExplorerUrls: [...network.blockExplorerUrls],
                        nativeCurrency: {...network.nativeCurrency},
                        rpcUrls: [...network.rpcUrls],
                    }],
                });
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: hexifyChainId }],
                });
                doSwitch(network);
            } else {
                console.log(error);
            }
        }
    }
}

export function alchemyNetwork(network: Network) : AlchemyNetwork {
    if (network.chainId == "5") {
        return AlchemyNetwork.ETH_GOERLI;
    }
    if (network.chainId == "137") {
        return AlchemyNetwork.MATIC_MAINNET;
    }
    if (network.chainId == "80001") {
        return AlchemyNetwork.MATIC_MUMBAI;
    }
    throw new Error("Unsupported network");
}

export function alchemy(network?: Network) {
    network = network || useNetworkStore().network;
    return new Alchemy({
        apiKey: network!.alchemy.key,
        network: alchemyNetwork(network!)
    });
}

export function getProvider(network?: Network) {
    network = network || useNetworkStore().network;
    return new ethers.providers.AlchemyProvider(
        Number(network!.chainId),
        network!.alchemy.key
    );
}

export function getInfuraProvider(network?: Network) {
    network = network || useNetworkStore().network;
    return new ethers.providers.InfuraProvider(
        Number(network!.chainId),
        import.meta.env.VITE_INFURA_API_KEY
    );
}

const functions = getFunctions();
export async function getPriceInfo(network: Network) : Promise<PriceInfo> {
    const priceInfo = useNetworkStore().priceInfo[network.name];
    // refresh every 15 mins
    if (!priceInfo || priceInfo.updatedAt < new Date().getTime() - 900000) {
        const getPriceInfo = httpsCallable(functions, 'priceInfo');
        const result = await getPriceInfo({chainId: network.chainId});
        const info : {
            nativeCurrencyInUsd: string,
            gasPrice: string
        } = (result.data as any).priceInfo;
        useNetworkStore().refreshPriceInfo(network, {
            nativeCurrencyInUsd: new BigNumber(info.nativeCurrencyInUsd),
            gasPrice: EthBigNumber.from(info.gasPrice),
            updatedAt: new Date().getTime()
        });
    }
    return useNetworkStore().priceInfo[network.name];
}