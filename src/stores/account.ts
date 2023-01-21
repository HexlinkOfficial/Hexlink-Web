import { defineStore } from 'pinia';
import type { Network, Account } from '@/types';
import { useNetworkStore } from '@/stores/network';
import { SUPPORTED_NETWORKS } from '@/configs/network';

export const useAccountStore = defineStore({
    id: 'account',
    state: (): {
        accounts: {[key: string]: Account | undefined} 
    }=> ({accounts: {}}),
    persist: true,
    getters: {
        account: (state) : Account | undefined => {
            const network = useNetworkStore().network;
            return state.accounts[network.name];
        }
    },
    actions: {
        setAccount(network: Network, account: Account) {
            this.accounts[network.name] = account;
        },
        reset() {
            SUPPORTED_NETWORKS.forEach(network => delete this.accounts[network.name]);
        },
    },
})