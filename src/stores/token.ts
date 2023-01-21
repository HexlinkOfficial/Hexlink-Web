import { defineStore } from 'pinia'
import { useNetworkStore } from "@/stores/network";
import { SUPPORTED_NETWORKS } from "@/configs/network";
import type { Token, Preference } from '@/types';

interface TokenMap {
    [key: string]: Token
}

const network = () => {
    return useNetworkStore().network!;
}

export const useTokenStore = defineStore({
    id: 'tokens',
    state: (): {[key: string]: TokenMap} => ({ }),
    persist: true,
    getters: {
        tokens: (state) : Token[] => {
            return Object.values(state[network().chainId] || {});
        },
        visiableTokens() : Token[] {
            return this.tokens.filter(t => t.preference?.display);
        },
        token: (state) => {
            return (address: string) : Token => {
                return state[network().chainId][address.toLowerCase()];
            }
        },
        nativeCoin: (state) => {
            const nativeCoin = network().address.nativeCoin as string;
            return state[network().chainId][nativeCoin.toLowerCase()];
        },
        wrappedCoin: (state) => {
            const wrappeCoin = network().address.wrappeCoin as string;
            return state[network().chainId][wrappeCoin.toLowerCase()];
        },
        stableCoins: (state) => {
            const addresses = network().address.stableCoins as string[];
            return addresses.map(addr => state[network().chainId][addr.toLowerCase()]);
        },
    },
    actions: {
        set(token: Token) {
            token.address = token.address.toLowerCase();
            if (this[token.chainId.toString()]) {
                this[token.chainId.toString()][token.address] = token;
            } else {
                this[token.chainId.toString()] = { [token.address]: token };
            }
        },
        setMulti(tokens: Token[]) {
            tokens.forEach(t => this.set(t));
        },
        setPreference(token: Token, p: Preference) {
            this[token.chainId.toString()][token.address].preference = p;
        },
        reset() {
            SUPPORTED_NETWORKS.forEach(network => delete this[network.name]);
        }
    }
});