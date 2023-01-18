
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
    redpacket(state) : RedPacket {
      const network = useNetworkStore().network;
      return state[network!.name]?.creating;
    },
    useHex(state) : boolean {
      const network = useNetworkStore().network;
      return state[network!.name]?.useHexlink;
    },
    packetStatus(state): boolean {
      const network = useNetworkStore().network;
      return state[network!.name]?.status;
    }
  },
  actions: {
    beforeCreate(network: Network, redpacket: RedPacket, useHex: boolean) {
      console.log("Creating Red Packet...");
      this[network.name] = { status: true, creating: redpacket, useHexlink: useHex };
    },
    closeModal(network: Network) {
      console.log("Closing Modal...");
      this[network.name].status = false;
      console.log(this[network.name].status);
    }
  },
})


