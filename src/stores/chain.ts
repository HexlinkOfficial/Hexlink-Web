import { defineStore } from 'pinia';
import type { PriceInfo } from '../../functions/redpacket';
import { getChain } from "../../functions/common";
import type { Provider } from "@ethersproject/providers";
import { getInfuraProvider } from '@/web3/network';
import type { Chain } from "../../functions/common";

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