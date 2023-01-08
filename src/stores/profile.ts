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
        init(account: Account, tokens: { [key: string]: Token }) {
            const network = useNetworkStore().network.name;
            this.profiles[network] = {
                account,
                tokens,
                initiated: true
            };
        },
        addToken(token: Token) {
            const tokenAddr = token.metadata.address.toLowerCase();
            const network = useNetworkStore().network.name;
            this.profiles[network].tokens[tokenAddr] = token;
        },
        removeToken(tokenAddr: string) {
            const network = useNetworkStore().network.name;
            delete this.profiles[network].tokens[tokenAddr.toLowerCase()]
        },
        updateBalance(tokenAddr: string, balance: NormalizedTokenBalance) {
            const network = useNetworkStore().network.name;
            this.profiles[network].tokens[tokenAddr.toLowerCase()].balance = balance;
        },
        updatePreference(tokenAddr: string, preference: Preference) {
            const network = useNetworkStore().network.name;
            this.profiles[network].tokens[tokenAddr.toLowerCase()].preference = preference;
        },
        clear() {
            this.profiles = {};
        },
    },
})