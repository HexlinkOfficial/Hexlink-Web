import { defineStore } from 'pinia';
import type { Token, Network, Profile, Preference } from '@/types';
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
        // tokens with balance > 0
        feasibleTokens: (state) => Object.values(
            state.profiles[state.network.name]?.tokens || []
        ).filter(t => t.preference?.display && t.balance?.value.gt(0)),
    },
    actions: {
        switchNetwork(network: Network) {
            console.log("Switching to network " + network.chainName);
            this.network = network;
        },
        setProfile(network: Network, profile: Profile) {
            this.profiles[network.name] = profile;
        },
        addToken(token: Token) {
            this.profile.tokens[token.metadata.address] = token;
        },
        removeToken(tokenAddr: string) {
            delete this.profile.tokens[tokenAddr]
        },
        setPreference(tokenAddr: string, preference: Preference) {
            this.profile.tokens[tokenAddr].preference = preference;
        },
        clear() {
            this.network = {...GOERLI};
            this.profiles = {};
        },
    },
})