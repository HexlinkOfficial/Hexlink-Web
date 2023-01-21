import { defineStore } from 'pinia';
import type { Network, Account } from '@/types';
import { useNetworkStore } from '@/stores/network';
import { SUPPORTED_NETWORKS } from '@/configs/network';

export const useAccountStore = defineStore({
    id: 'account',
    state: (): {[key: string]: Account} => ({}),
    persist: true,
    getters: {
        account:  (state) : Account | undefined => {
            const network = useNetworkStore().network;
            return state[network!.name];
        }
    },
    actions: {
        setAccount(network: Network, account: Account) {
            this[network.name] = account;
        },
        reset() {
            SUPPORTED_NETWORKS.forEach(network => delete this[network.name]);
        },
    },
})