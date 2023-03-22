import { defineStore } from 'pinia';
import type { RedPacketInput, RedPacketErc721Input, RedPacketDB} from "../../../functions/redpacket";

type Status = "" | "confirming" | "processing" | "error" | "success";
type ClaimStatus = "" | "loading" | "success" | "error";
export type AccountType = "hexlink" | "wallet";

interface RedPacketStore {
  status: Status;
  redpacket: RedPacketInput | RedPacketErc721Input | undefined;
  account: AccountType;
  claimStatus: ClaimStatus;
  claim: {
    redpacket: RedPacketDB;
    opId: number;
  } | undefined
}

export const useRedPacketStore = defineStore({
  id: 'redpacket',
  state: (): RedPacketStore => ({
    status: "",
    redpacket: undefined,
    account: "hexlink",
    claimStatus: "",
    claim: undefined
  }),
  persist: true,
  actions: {
    beforeCreate(redpacket: RedPacketInput | RedPacketErc721Input) {
      this.redpacket = redpacket;
      this.status = "confirming";
    },
    afterCreate(opId?: number) {
      this.redpacket.opId = opId;
      this.status = "success";
    },
    setStatus(status: Status) {
      this.status = status;
    },
    setClaimStatus(claimStatus: ClaimStatus) {
      this.claimStatus = claimStatus;
    },
    afterClaimed(redpacket: RedPacketDB, opId: number) {
      this.claim = { redpacket, opId };
      this.claimStatus = "success";
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


