import type { Account } from "../../functions/common";
import { defineStore } from 'pinia'
import { ethers } from "ethers";

export const useWalletStore = defineStore({
    id: 'wallet',
    state: (): {
        connected: boolean,
        wallet: string;
        walletIcon: string;
        account?: Account;
        provider: any;
    } => ({
        connected: false,
        wallet: "",
        walletIcon: "@/assets/svg/wallet.svg",
        account: undefined,
        provider: undefined
    }),
    persist: true,
    actions: {
        connectWallet(
            wallet: string,
            walletIcon: string,
            account: Account,
            provider: any,
        ) {
            this.wallet = wallet;
            this.walletIcon = walletIcon;
            this.account = account;
            this.connected = true;
            this.provider = provider;
        },
        disconnectWallet() {
            this.connected = false;
            this.wallet = "";
            this.walletIcon = "",
            this.account = undefined,
            this.provider = undefined;
            console.log("External account disconnected");
        },
        switchAccount(account: Account) {
            this.account = account;
        },
    },
})