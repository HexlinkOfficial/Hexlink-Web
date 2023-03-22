import type { Account } from "../../../functions/common";
import { defineStore } from 'pinia'

export const useWalletStore = defineStore({
    id: 'wallet',
    state: (): {
        connected: boolean,
        wallet: string;
        walletIcon: string;
        account?: Account;
    } => ({
        connected: false,
        wallet: "",
        walletIcon: "@/assets/svg/wallet.svg",
        account: undefined,
    }),
    persist: true,
    actions: {
        connectWallet(
            wallet: string,
            walletIcon: string,
            account: Account,
        ) {
            this.wallet = wallet;
            this.walletIcon = walletIcon;
            this.account = account;
            this.connected = true;
        },
        disconnectWallet() {
            this.connected = false;
            this.wallet = "";
            this.walletIcon = "",
            this.account = undefined,
            console.log("External account disconnected");
        },
        switchAccount(account: Account) {
            this.account = account;
        },
    },
})