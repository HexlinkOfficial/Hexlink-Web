import { defineStore } from 'pinia'
import { useNetworkStore } from "@/stores/network";
import { SUPPORTED_NETWORKS, getNetwork } from "@/configs/network";
import type { Token, Preference } from '@/types';

interface TokenMap {
    [key: string]: Token
}

const network = () => {
    return useNetworkStore().network!;
}

export const useTokenStore = defineStore({
    id: 'tokens',
    state: (): {
        data: {[key: string]: TokenMap}
    } => ({data: {}}),
    persist: true,
    getters: {
        tokens: (state) : Token[] => {
            return Object.values(state.data[network().name] || {});
        },
        visiableTokens() : Token[] {
            return this.tokens.filter(t => t.preference?.display);
        },
        token: (state) => {
            return (address: string) : Token => {
                return state.data[network().name][address.toLowerCase()];
            }
        },
        nativeCoin: (state) => {
            const n = network();
            const nativeCoin = n.address.nativeCoin as string;
            return state.data[n.name][nativeCoin.toLowerCase()];
        },
        wrappedCoin: (state) => {
            const n = network();
            const wrappeCoin = n.address.wrappeCoin as string;
            return state.data[n.name][wrappeCoin.toLowerCase()];
        },
        stableCoins: (state) => {
            const n = network();
            const addresses = n.address.stableCoins as string[];
            return addresses.map(addr => state.data[n.name][addr.toLowerCase()]);
        },
    },
    actions: {
        set(token: Token) {
            token.address = token.address.toLowerCase();
            const network = getNetwork(token.chain || token.chainId);
            if (this.data[network.name]) {
                this.data[network.name][token.address] = token;
            } else {
                this.data[network.name] = { [token.address]: token };
            }
        },
        setMulti(tokens: Token[]) {
            tokens.forEach(t => this.set(t));
        },
        setPreference(token: Token, p: Preference) {
            const network = getNetwork(token.chain || token.chainId);
            this.data[network.name][token.address].preference = p;
        },
        reset() {
            SUPPORTED_NETWORKS.forEach(network => delete this.data[network.name]);
        }
    }
});