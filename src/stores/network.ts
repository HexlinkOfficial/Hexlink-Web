import { defineStore } from 'pinia';
import type { Network } from '@/types';
import { nativeCoinAddress } from '@/configs/tokens';
import { GOERLI } from "@/configs/network";

export const useNetworkStore = defineStore({
    id: 'network',
    state: (): { network: Network } => ({
        network: {...GOERLI},
    }),
    persist: true,
    getters: {
        nativeCoinAddress: (state) => nativeCoinAddress(state.network),
    },
    actions: {
        switchNetwork(network: Network) {
            console.log("Switching to network " + network.chainName);
            this.network = network;
        },
        reset() {
            this.network = {...GOERLI};
        },
    },
})