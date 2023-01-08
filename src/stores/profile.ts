import { defineStore } from 'pinia';
import type { Token, Profile, Preference, Account, NormalizedTokenBalance } from '@/types';
import { useNetworkStore } from './network';
import { BigNumber } from "bignumber.js";

export const useProfileStore = defineStore({
    id: 'profile',
    state: (): {profiles: { [key: string]: Profile }} => ({profiles: {}}),
    persist: true,
    getters: {
        profile: (state) : Profile => {
            return state.profiles[useNetworkStore().network.name];
        },
        balance() {
            return (address: string) =>
                this.profile?.tokens[address.toLowerCase()]?.balance;
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
                t => {
                    // TODO: sometimes it's string instead of bignumbeer
                    // so we set it to bignumber again here. We need to 
                    // figure out where we set this as string and fix it
                    const balance = new BigNumber(t.balance?.value || 0);
                    return t.preference?.display && balance.gt(0)
                }
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