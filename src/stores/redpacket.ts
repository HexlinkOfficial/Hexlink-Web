
import { defineStore } from 'pinia';
import type { RedPacket } from "../../functions/redpacket";

type Status = "" | "confirming" | "processing" | "error" | "success";
export type AccountType = "hexlink" | "wallet";

interface CreatingRedPacket {
  creatingStatus: Status;
  redpacket: RedPacket | undefined;
  account: AccountType;
  claimingStatus: {[key: string]: Status};
}

export const useRedPacketStore = defineStore({
  id: 'redpacket',
  state: (): CreatingRedPacket => ({
    creatingStatus: "",
    redpacket: undefined,
    account: "hexlink",
    claimingStatus: {},
  }),
  persist: true,
  actions: {
    beforeCreate(redpacket: RedPacket) {
      this.creatingStatus = "confirming";
      this.redpacket = redpacket;
    },
    setCreatingStatus(status: Status) {
      this.creatingStatus = status;
    },
    setClaimingStatus(redPacketId: string, status: Status) {
      this.claimingStatus[redPacketId] = status;
    },
    setAccount(account: AccountType) {
      this.account = account;
    },
    reset() {
      this.creatingStatus = "";
      this.redpacket = undefined;
      this.account = "hexlink";
      this.claimingStatus = {};
    }
  },
});


