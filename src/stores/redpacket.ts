
import { defineStore } from 'pinia';
import type { RedPacket, Network } from "@/types";
import { useNetworkStore } from './network';

export const useRedPacketStore = defineStore({
  id: 'redpacket',
  state: (): {
    [key: string]: {
      status: boolean
      creating: RedPacket
      useHexlink: boolean
    }
  } => ({}),
  persist: true,
  getters: {
    redpacket() : RedPacket {
      const network = useNetworkStore().network;
      return this[network!.name].creating;
    },
    useHex() : boolean {
      const network = useNetworkStore().network;
      return this[network!.name].useHexlink;
    },
    packetStatus(): boolean {
      const network = useNetworkStore().network;
      return this[network!.name].status!;
    }
  },
  actions: {
    beforeCreate(network: Network, redpacket: RedPacket, useHex: boolean, status: boolean) {
      console.log("Creating Red Packet...");
      this[network.name] = { status: status, creating: redpacket, useHexlink: useHex };
    }
  },
})


