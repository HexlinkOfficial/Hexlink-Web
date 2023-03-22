import { defineStore } from 'pinia'
import { useChainStore } from "@/stores/chain";
import {
    SUPPORTED_CHAINS,
    nativeCoinAddress,
    wrappedCoinAddress,
    stableCoinAddresses,
    getChain
} from "../../../functions/common";
import type { Token, TokenPreference } from "../../../functions/common";

interface TokenMap {
    [key: string]: Token
}

const chain = () => {
    return useChainStore().chain!;
}

export const useTokenStore = defineStore({
    id: 'tokens',
    state: (): {
        data: {[key: string]: TokenMap}
    } => ({data: {}}),
    persist: true,
    getters: {
        tokens: (state) : Token[] => {
            return Object.values(state.data[chain().name] || {});
        },
        visiableTokens() : Token[] {
            return this.tokens.filter(t => t.preference?.display);
        },
        token: (state) => {
            return (address: string) : Token => {
                return state.data[chain().name][address.toLowerCase()];
            }
        },
        nativeCoin: (state) => {
            const c = chain();
            return state.data[c.name][nativeCoinAddress(c)];
        },
        wrappedCoin: (state) => {
            const c = chain();
            const wrapped = wrappedCoinAddress(c);
            if (wrapped) {
                return state.data[c.name][wrapped];
            }
        },
        stableCoins: (state) => {
            const c = chain();
            return stableCoinAddresses(c).map(
                addr => state.data[c.name][addr]
            );
        },
    },
    actions: {
        set(token: Token) {
            token.address = token.address.toLowerCase();
            const chain = getChain(token.chain || token.chainId);
            if (this.data[chain.name]) {
                this.data[chain.name][token.address] = token;
            } else {
                this.data[chain.name] = { [token.address]: token };
            }
        },
        setMulti(tokens: Token[]) {
            tokens.forEach(t => this.set(t));
        },
        setPreference(token: Token, p: TokenPreference) {
            const chain = getChain(token.chain || token.chainId);
            this.data[chain.name][token.address].preference = p;
        },
        reset() {
            SUPPORTED_CHAINS.forEach(chain => delete this.data[chain.name]);
        }
    }
});