import { defineStore } from 'pinia';
import type { PriceInfo, Network } from '@/types';
import { getNetwork } from '@/configs/network';

export const useNetworkStore = defineStore({
    id: 'network',
    state: (): {
        current: number | string,
        priceInfos: {[key: string]: PriceInfo}
    } => ({
        current: "goerli",
        priceInfos: {}
    }),
    persist: true,
    getters: {
        network: (state) : Network => {
            return getNetwork(state.current)
        },
        priceInfo: (state) : PriceInfo => {
            const network = useNetworkStore().network.name
            return state.priceInfos[network];
        }
    },
    actions: {
        switchNetwork(network: Network) {
            console.log("Switching to chain " + network.name);
            this.current = network.name;
        },
        refreshPriceInfo(network: Network, priceInfo: PriceInfo) {
            this.priceInfos[network.name] = priceInfo;
        },
        reset() {
            this.current = "goerli";
            this.priceInfos = {};
        }
    },
});