import { defineStore } from 'pinia';
import type { Token, Preference } from '@/types';

export const useTokenStore = defineStore({
    id: 'tokens',
    state: (): {
        initiated: boolean,
        tokens: { [key: string]: Token }
    } => ({
        initiated: false,
        tokens: {}
    }),
    persist: true,
    getters: {
        visiableTokens: (state) => Object.values(state.tokens).filter(
            t => t.preference?.display || false
        ),
        // tokens with balance > 0
        feasibleTokens: (state) => Object.values(state.tokens).filter(
            t => t.balance?.value.gt(0) || false
        )
    },
    actions: {
        init(tokens: { [key: string]: Token }) {
            this.initiated = true;
            this.tokens = tokens;
        },
        add(token: Token) {
            this.tokens[token.metadata.address] = token;
        },
        remove(tokenAddr: string) {
            delete this.tokens[tokenAddr]
        },
        updatePreference(tokenAddr: string, preference: Preference) {
            this.tokens[tokenAddr].preference = preference;
            console.log("Updating preference");
        },
        clear() {
            this.initiated = false;
            this.tokens = {};
        },
    },
})