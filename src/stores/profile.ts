import { defineStore } from 'pinia';
import type { Token, Network, Profile, Preference, Account, NormalizedTokenBalance } from '@/types';
import { useNetworkStore } from './network';

export const useProfileStore = defineStore({
    id: 'profile',
    state: (): {
        profiles: { [key: string]: Profile }
    } => ({
        profiles: {}
    }),
    persist: true,
    getters: {
        profile: (state) : Profile => {
            return state.profiles[useNetworkStore().network.name];
        },
        visiableTokens() : Token[] {
            return Object.values(
                this.profile?.tokens || []
            ).filter(
                (t : Token) => t.preference?.display
            );
        },
        // display is true and tokens with balance > 0
        feasibleTokens() : Token[] {
            return Object.values(
                this.profile?.tokens || []
            ).filter(
                t => t.preference?.display && t.balance?.value.gt(0)
            );
        }
    },
    actions: {
        init(
            network: Network,
            account: Account,
            tokens: { [key: string]: Token }
        ) {
            this.profiles[network.name] = {
                account,
                tokens,
                initiated: true
            };
        },
        addToken(token: Token) {
            const tokenAddr = token.metadata.address.toLowerCase();
            this.profile.tokens[tokenAddr] = token;
        },
        removeToken(tokenAddr: string) {
            delete this.profile.tokens[tokenAddr.toLowerCase()]
        },
        updateBalance(tokenAddr: string, balance: NormalizedTokenBalance) {
            this.profile.tokens[tokenAddr.toLowerCase()].balance = balance;
        },
        updatePreference(tokenAddr: string, preference: Preference) {
            this.profile.tokens[tokenAddr.toLowerCase()].preference = preference;
        },
        clear() {
            this.profiles = {};
        },
    },
})