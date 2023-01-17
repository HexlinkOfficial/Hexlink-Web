import { defineStore } from 'pinia';
import type { Network, Token, Profile, Preference, Account, NormalizedTokenBalance } from '@/types';
import { useNetworkStore } from './network';
import { BigNumber as EthBigNumber } from 'ethers';

export const useProfileStore = defineStore({
    id: 'profile',
    state: (): {profiles: { [key: string]: Profile }} => ({profiles: {}}),
    persist: true,
    getters: {
        profile: (state) : Profile | undefined => {
            const networkName = useNetworkStore().network?.name;
            if (networkName) {
                return state.profiles[networkName]
            }
        },
        account() : Account | undefined {
            return this.profile?.account;
        },
        nativeToken() : Token | undefined {
            const nativeCoin = useNetworkStore().nativeCoinAddress;
            return this.profile?.tokens[nativeCoin];
        },
        balance() {
            return (
                address: string
            ) : NormalizedTokenBalance => {
                return this.profile?.tokens[
                    address.toLowerCase()
                ]?.balance || {
                    value: EthBigNumber.from(0),
                    normalized: "0"
                };
            }
        },
        visiableTokens() : Token[] {
            return Object.values(
                this.profile?.tokens || []
            ).filter((t : Token) => t.preference?.display);
        },
        // display tokens with balance > 0
        feasibleTokens() : Token[] {
            return Object.values(this.profile?.tokens || {}).filter(
                t => EthBigNumber.from(t.balance?.value || 0).gt(0)
            );
        }
    },
    actions: {
        init(network: Network, account: Account, tokens: { [key: string]: Token }) {
            this.profiles[network.name] = {
                account,
                tokens,
                initiated: true
            };
        },
        addToken(token: Token) {
            const tokenAddr = token.metadata.address.toLowerCase();
            const network = useNetworkStore().network!.name;
            this.profiles[network].tokens[tokenAddr] = token;
        },
        removeToken(tokenAddr: string) {
            const network = useNetworkStore().network!.name;
            delete this.profiles[network].tokens[tokenAddr.toLowerCase()]
        },
        updateBalance(tokenAddr: string, balance: NormalizedTokenBalance) {
            const network = useNetworkStore().network!.name;
            this.profiles[network].tokens[tokenAddr.toLowerCase()].balance = {...balance};
        },
        updatePreference(tokenAddr: string, preference: Preference) {
            const network = useNetworkStore().network!.name;
            this.profiles[network].tokens[tokenAddr.toLowerCase()].preference = preference;
        },
        clear() {
            this.profiles = {};
        },
    },
})