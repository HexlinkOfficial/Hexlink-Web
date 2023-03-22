import { defineStore } from 'pinia';
import { getChain } from "../../../functions/common";
import type { Provider } from "@ethersproject/providers";
import { getProvider } from '@/web3/network';
import type { Chain } from "../../../functions/common";

export const useChainStore = defineStore({
    id: 'chain',
    state: (): {
        current: number | string,
    } => ({
        current: "arbitrum",
    }),
    persist: true,
    getters: {
        chain: (state) : Chain => {
            return getChain(state.current);
        },
        provider() : Provider {
            return getProvider(this.chain);
        },
    },
    actions: {
        switchNetwork(chain: Chain) {
            console.log("Switching to chain " + chain.name);
            this.current = chain.name;
        },
        reset() {
            this.current = "arbitrum";
        }
    },
});