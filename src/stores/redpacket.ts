
import { defineStore } from 'pinia';
import type { CreatedRedPacket, RedPacketInput } from "@/types";

export const useRedPacketStore = defineStore({
  id: 'redpacket',
  state: (): {
    [key: string]: {
      creating: RedPacketInput | undefined,
      created: { [key: string]: CreatedRedPacket }
    }
  } => ({ }),
  persist: true,
  actions: {
  },
})


