
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
    beforeCreate(network: Network, redpacket: RedPacket, useHex: boolean, packetStatus: boolean) {
      console.log("Creating Red Packet...");
      console.log(this[network.name]);
      this[network.name] = { status: packetStatus, creating: redpacket, useHexlink: useHex };
      console.log(this[network.name].status);
      console.log(this[network.name]);
      console.log(this[network.name].creating);
      console.log(this.packetStatus);
    }
  },
})


