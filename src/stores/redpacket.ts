
import { defineStore } from 'pinia';
import type { RedPacket } from "@hexlink/redpacket";

type Status = "" | "confirming" | "processing" | "error" | "success";
export type AccountType = "hexlink" | "wallet";

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
    beforeCreate(redpacket: RedPacket) {
      this.status = "confirming";
      this.redpacket = redpacket;
    },
    setStatus(status: Status) {
      this.status = status;
    },
    setAccount(account: AccountType) {
      this.account = account;
    },
    reset() {
      this.status = "";
      this.redpacket = undefined;
      this.account = "hexlink";
    }
  },
});


