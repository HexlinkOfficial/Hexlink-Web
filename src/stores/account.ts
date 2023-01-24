import { defineStore } from 'pinia';

import type { Chain } from "../../functions/common";
import { SUPPORTED_CHAINS } from "../../functions/common";
import type { Account } from "../../functions/common";
import { useChainStore } from '@/stores/chain';

export const useAccountStore = defineStore({
    id: 'account',
    state: (): {
        accounts: {[key: string]: Account | undefined} 
    }=> ({accounts: {}}),
    persist: true,
    getters: {
        account: (state) : Account | undefined => {
            return state.accounts[useChainStore().chain.name];
        }
    },
    actions: {
        setAccount(chain: Chain, account: Account) {
            this.accounts[chain.name] = account;
        },
        reset() {
            SUPPORTED_CHAINS.forEach(chain => delete this.accounts[chain.name]);
        },
    },
})