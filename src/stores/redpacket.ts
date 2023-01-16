
import { defineStore } from 'pinia';
import type { CreatedRedPacket, RedPacket } from "@/types";

export const useRedPacketStore = defineStore({
  id: 'redpacket',
  state: (): {
    [key: string]: {
      creating: RedPacket | undefined,
      created: { [key: string]: CreatedRedPacket }
    }
  } => ({ }),
  persist: true,
  actions: {
  },
})


