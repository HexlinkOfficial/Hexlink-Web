import { defineStore } from 'pinia';

export const useStatusStore = defineStore({
  id: 'status',
  state: (): {
    status: Array<any>
  } => ({
    status: [
      { 'Total Created': 0 },
      { 'Total Claimed': 0 }
    ]
  }),
  persist: true,
  getters: {
    allStatus: (state): any => {
      return state.status;
    },
  },
  actions: {
    setStatus(statusArr: any) {
      this.status = statusArr;
    },
    reset() {
      this.status = [
        { 'Total Created': 0 },
        { 'Total Claimed': 0 }
      ]
    }
  },
})