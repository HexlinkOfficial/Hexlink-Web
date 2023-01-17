import { defineStore } from 'pinia';
import type { Network, PriceInfo } from '@/types';
import { GOERLI } from "@/configs/network";

export const useNetworkStore = defineStore({
    id: 'network',
    state: (): {
        network: Network | undefined,
        priceInfo: {[key: string]: PriceInfo}
    } => ({
        network: {...GOERLI},
        priceInfo: {}
    }),
    persist: true,
    getters: {
        nativeCoinAddress: (state) : string => state.network!.address.nativeCoin as string,
        wrappedCoinAddress: (state) : string => state.network!.address.wrappeCoin as string,
        stableCoinAddresses: (state) : string[] => state.network!.address.stableCoins as string[],
    },
    actions: {
        switchNetwork(network: Network) {
            console.log("Switching to network " + network.chainName);
            this.network = {...network};
        },
        refreshPriceInfo(network: Network, priceInfo: PriceInfo) {
            this.priceInfo[network.name] = priceInfo;
        },
        reset() {
            this.network = undefined;
            this.priceInfo = {};
        }
    },
})