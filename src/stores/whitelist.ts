import { defineStore } from 'pinia';

export const useWhitelistStore = defineStore({
  id: 'whitelist',
  state: (): {
    accounts: string[],
  } => ({
    accounts: []
  }),
  persist: true,
  getters: {
    whitelist: (state): string[] => {
      return state.accounts;
    },
  },
  actions: {
    addToAccounts(account: string) {
      this.accounts.push(account);
    },
  },
})