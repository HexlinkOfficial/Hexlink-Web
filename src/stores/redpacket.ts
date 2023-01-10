
import { defineStore } from 'pinia';
import type { CreatedRedPacket, CreatingRedPacket } from "@/types";
import { nativeCoinAddress } from '@/configs/tokens';

export const useRedPacketStore = defineStore({
  id: 'redpacket',
  state: (): {
    [key: string]: {
      creating: CreatingRedPacket | undefined,
      created: { [key: string]: CreatedRedPacket }
    }
  } => ({ }),
  persist: true,
  getter: {
    
  },
  actions: {
  },
})


