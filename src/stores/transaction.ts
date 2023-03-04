import type { Account } from "../../functions/common";
import { defineStore } from 'pinia'

export const useTransactionStore = defineStore({
  id: 'transaction',
  state: (): {
    status: string
  } => ({
    status: ""
  }),
  persist: true,
  actions: {
    updateState(status: string) {
      this.status = status;
    },
    reset() {
      this.status = "";
    }
  }
})