import { defineStore } from 'pinia'
import type { Network } from "@/types";
import { POLYGON } from "@/configs/network";

export const useNetworkStore = defineStore({
    id: 'network',
    state: () : {network: Network} => ({
        network: POLYGON
    }),
    persist: true,
    actions: {
        switchNetwork(network: Network) {
            console.log("Switching to network " + network.chainName);
            this.network = network;
        },
    },
})