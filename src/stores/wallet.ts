import type { Wallet } from "@/types";
import { defineStore } from 'pinia'

export const useWalletStore = defineStore({
    id: 'wallet',
    state: (): {
        connected: boolean,
        wallet?: Wallet
    } => ({ connected: false }),
    persist: true,
    actions: {
        connectWallet(wallet: Wallet) {
            this.wallet = wallet;
            this.connected = true;
        },
        disconnectWallet() {
            this.connected = false;
            this.wallet = undefined;
            console.log("External account disconnected");
        },
    },
})