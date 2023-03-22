import { defineStore } from 'pinia';

export const useNftStore = defineStore({
  id: 'nft',
  state: (): {
    contracts: string[],
    symbol: string[],
    name: string[],
    nftId: string[],
    image: string[]
  } => ({ 
    contracts: [],
    symbol: [],
    name: [],
    nftId: [],
    image: []
  }),
  persist: true,
  actions: {
    set(contracts: string[], symbol: string[], name: string[], nftId: string[], image: string[]) {
      this.contracts = contracts;
      this.symbol = symbol;
      this.name = name;
      this.nftId = nftId;
      this.image = image;
    },
    reset() {
      this.contracts = [],
      this.symbol = [],
      this.name = [],
      this.nftId = [],
      this.image = []
    }
  },
})