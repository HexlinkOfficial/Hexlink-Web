import { defineStore } from 'pinia';

export const useStatusStore = defineStore({
  id: 'status',
  state: (): {
    airdropStatus: Array<any>
  } => ({
    airdropStatus: [
      { 'Total Created': 0 },
      { 'Total Claimed': 0 }
    ]
  }),
  persist: true,
  getters: {
    allStatus: (state): any => {
      return state.airdropStatus;
    },
  },
  actions: {
    setStatus(statusArr: any) {
      this.airdropStatus = statusArr;
    },
    reset() {
      this.airdropStatus = [
        { 'Total Created': 0 },
        { 'Total Claimed': 0 }
      ]
    }
  },
})