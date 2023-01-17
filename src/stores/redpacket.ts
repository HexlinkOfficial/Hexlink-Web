
import { defineStore } from 'pinia';
import type { CreatedRedPacket, RedPacket, Network } from "@/types";
import { useNetworkStore } from './network';

export const useRedPacketStore = defineStore({
  id: 'redpacket',
  state: (): {
    [key: string]: {
      creating: RedPacket
      useHexlink: boolean
    }
  } => ({}),
  persist: true,
  getters: {
    redpacket() : RedPacket {
      const network = useNetworkStore().network;
      return this[network.name].creating;
    },
    useHex() : boolean {
      const network = useNetworkStore().network;
      return this[network.name].useHexlink;
    }
  },
  actions: {
    beforeCreate(network: Network, redpacket: RedPacket, useHex: boolean) {
      console.log("Creating Red Packet...");
      this[network.name] = { creating: redpacket, useHexlink: useHex };
    }
  },
})


