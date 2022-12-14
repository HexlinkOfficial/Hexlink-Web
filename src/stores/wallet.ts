import type { NormalizedTokenBalance, Wallet } from "@/types";
import { defineStore } from 'pinia'
import { useNetworkStore } from "@/stores/network";

type Balances = {[key: string]: NormalizedTokenBalance};

export const useWalletStore = defineStore({
    id: 'wallet',
    state: (): {
        connected: boolean,
        wallet?: Wallet,
        balanceMap: {[key: string]: Balances}
    } => ({
        connected: false,
        wallet: undefined,
        balanceMap: {},
    }),
    persist: true,
    getters: {
        balances: (state): Balances => {
            const network = useNetworkStore().network.name;
            return state.balanceMap[network] || {};
        },
        balance() {
            return (address: string) => this.balances[address.toLowerCase()];
        },
    },
    actions: {
        connectWallet(wallet: Wallet) {
            this.wallet = wallet;
            this.connected = true;
        },
        disconnectWallet() {
            this.connected = false;
            this.wallet = undefined;
            this.balanceMap = {};
            console.log("External account disconnected");
        },
        updateBalance(tokenAddr: string, balance: NormalizedTokenBalance) {
            const network = useNetworkStore().network.name;
            const address = tokenAddr.toLowerCase();
            if (this.balanceMap[network]) {
                this.balanceMap[network][address] = balance;
            } else {
                this.balanceMap[network] = {[address]: balance};
            }
        }
    },
})