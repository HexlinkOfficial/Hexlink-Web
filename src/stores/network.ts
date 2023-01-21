import { defineStore } from 'pinia';
import type { PriceInfo, Network } from '@/types';
import { getNetwork } from '@/configs/network';

export const useNetworkStore = defineStore({
    id: 'network',
    state: (): {
        chainId: number | string,
        priceInfo: {[key: string]: PriceInfo}
    } => ({
        chainId: 5,
        priceInfo: {}
    }),
    persist: true,
    getters: {
        network: (state) : Network => {
            return getNetwork(state.chainId)
        }
    },
    actions: {
        switchNetwork(chainId: string | number) {
            console.log("Switching to chain " + chainId);
            this.chainId = chainId;
        },
        refreshPriceInfo(chainId: string | number, priceInfo: PriceInfo) {
            this.priceInfo[chainId.toString()] = priceInfo;
        },
        reset() {
            this.chainId = 5;
            this.priceInfo = {};
        }
    },
});