import { defineStore } from 'pinia';
import type { Token, Preference } from '@/types';

export const useTokenStore = defineStore({
    id: 'tokens',
    state: (): {
        initiated: boolean,
        tokens: { [key: string]: Token }
    } => ({
        initiated: false,
        tokens: {}}
    ),
    persist: true,
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