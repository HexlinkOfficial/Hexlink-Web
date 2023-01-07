import { defineStore } from 'pinia';
import type { TokenMetadata } from "@/types";

export const useTokenStore = defineStore({
    id: 'tokens',
    state: (): {tokens: TokenMetadata[]} => ({
        tokens: []
    }),
    persist: true,
    actions: {
        addToken(token: TokenMetadata) {
            this.tokens.push(token)
        },
        remove(token: string) {
            this.tokens.filter(
                t => t.address.toLowerCase() == token.toLowerCase()
            );
        }
    },
})