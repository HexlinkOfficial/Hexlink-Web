
import { defineStore } from 'pinia';
import type { RedPacket } from "@/types";

type Status = "" | "confirming" | "processing" | "error" | "success";
type AccountType = "hexlink" | "wallet";

interface CreatingRedPacket {
  status: Status;
  redpacket: RedPacket | undefined;
  account: AccountType;
}

export const useRedPacketStore = defineStore({
  id: 'redpacket',
  state: (): CreatingRedPacket => ({
    status: "",
    redpacket: undefined,
    account: "hexlink",
  }),
  persist: true,
  actions: {
    beforeCreate(redpacket: RedPacket, account: string) {
      this.status = "confirming";
      this.redpacket = redpacket;
      this.account = "hexlink";
    },
    setStatus(status: Status) {
      this.status = status;
    },
    reset() {
      this.status = "";
      this.redpacket = undefined;
      this.account = "hexlink";
    }
  },
});


