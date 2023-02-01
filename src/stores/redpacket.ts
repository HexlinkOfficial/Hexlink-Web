
import { defineStore } from 'pinia';
import type { RedPacket } from "../../functions/redpacket";

type Status = "" | "confirming" | "processing" | "error" | "success";
export type AccountType = "hexlink" | "wallet";

export interface RedPacketInput extends RedPacket {
  balanceInput: string,
}

interface CreatingRedPacket {
  status: Status;
  redpacket: RedPacketInput | undefined;
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
    beforeCreate(redpacket: RedPacketInput) {
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


