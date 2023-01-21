import type { NormalizedTokenBalance, Wallet, Account } from "@/types";
import { defineStore } from 'pinia'
import { useNetworkStore } from "@/stores/network";
import { BigNumber as EthBigNumber } from 'ethers';

type Balances = {[key: string]: NormalizedTokenBalance};

export const useWalletStore = defineStore({
    id: 'wallet',
    state: (): {
        connected: boolean,
        wallet?: Wallet,
    } => ({
        connected: false,
        wallet: undefined,
    }),
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
        switchAccount(account: Account) {
            this.wallet!.account = account;
        },
        updateBalance(tokenAddr: string, balance: NormalizedTokenBalance) {
            const network = useNetworkStore().network!.name;
            const address = tokenAddr.toLowerCase();
        }
    },
})