import { defineStore } from 'pinia';
import type { Token, Network, Profile, Preference, Account, NormalizedTokenBalance } from '@/types';
import { nativeCoinAddress } from '@/configs/tokens';
import { GOERLI } from "@/configs/network";

export const useProfileStore = defineStore({
    id: 'profile',
    state: (): {
        network: Network,
        profiles: { [key: string]: Profile }
    } => ({
        network: {...GOERLI},
        profiles: {}
    }),
    persist: true,
    getters: {
        profile: (state) => state.profiles[state.network.name],
        visiableTokens: (state) => Object.values(
            state.profiles[state.network.name]?.tokens || []
        ).filter(t => t.preference?.display),
        nativeCoinAddress: (state) => nativeCoinAddress(state.network)
    },
    actions: {
        switchNetwork(network: Network) {
            console.log("Switching to network " + network.chainName);
            this.network = network;
        },
        setAccount(network: Network, account: Account) {
            this.profiles[network.name] = {
                account,
                tokenInitiated: false,
                tokens: {}
            };
        },
        setTokens(network: Network, tokens: { [key: string]: Token }) {
            this.profiles[network.name].tokenInitiated = true;
            this.profiles[network.name].tokens = tokens;
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
            this.network = {...GOERLI};
            this.profiles = {};
        },
    },
})