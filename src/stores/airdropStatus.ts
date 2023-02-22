import { defineStore } from 'pinia';

export const useStatusStore = defineStore({
  id: 'status',
  state: (): {
    status: Array<any>
  } => ({
    status: []
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
  },
})