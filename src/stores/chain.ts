import { defineStore } from 'pinia';
import type { PriceInfo } from '@/types';
import { getChain } from '@hexlink/common';
import type { Provider } from "@ethersproject/providers";
import { getInfuraProvider } from '@/web3/network';
import type { Chain } from "@hexlink/common";

export const useChainStore = defineStore({
    id: 'chain',
    state: (): {
        current: number | string,
        priceInfos: {[key: string]: PriceInfo}
    } => ({
        current: "goerli",
        priceInfos: {}
    }),
    persist: true,
    getters: {
        chain: (state) : Chain => {
            return getChain(state.current);
        },
        priceInfo: (state) : PriceInfo => {
            const network = getChain(state.current);
            return state.priceInfos[network.name];
        },
        refunder(): string {
            return "0x1A811678eEEDF16a1D0dF4b12e290F78a61A28F9";
        },
        provider() : Provider {
            return getInfuraProvider(this.chain);
        },
    },
    actions: {
        switchNetwork(chain: Chain) {
            console.log("Switching to chain " + chain.name);
            this.current = chain.name;
        },
        refreshPriceInfo(chain: Chain, priceInfo: PriceInfo) {
            this.priceInfos[chain.name] = priceInfo;
        },
        reset() {
            this.current = "goerli";
            this.priceInfos = {};
        }
    },
});