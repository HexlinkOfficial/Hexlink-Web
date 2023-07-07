import { defineStore } from 'pinia';
import { useChainStore } from './chain';
import { useAuthStore } from './auth';
import { getAccountAddress } from '@/web3/account';

export interface Erc20Transfer {
    from: string;
    to: string;
    amount: string;
    token: {
        name: string;
        symbol: string;
        logoURI: string;
        address: string;
        decimals: number;
    }
}

export enum TxStatus {
    PENDING,
    FAILED,
    SUCCESS,
}

export interface UserOp {
    userOpHash: string;
    erc20Transfers: Erc20Transfer[];
    status: TxStatus;
    sentAt: number;
    updateAt: number;
}

const chain = () => {
    return useChainStore().chain!;
}

export const useHistoryStore = defineStore({
    id: 'history',
    state: (): {
        histories: {[key: string]: UserOp[]}
    } => ({
        histories: {},
    }),
    persist: true,
    getters: {
        history: (state) => {
            const c = chain();
            return state.histories[c.name];
        },
        failed: (state) => {
            const c = chain();
            return state.histories[c.name].map(
                h => h.status == TxStatus.FAILED
            );
        },
        pending: (state) => {
            const c = chain();
            return state.histories[c.name].map(
                h => h.status == TxStatus.PENDING
            );
        },
        success: (state) => {
            const c = chain();
            return state.histories[c.name].map(
                h => h.status == TxStatus.SUCCESS
            );
        }
    },
    actions: {
        add(userOp: UserOp) {
            this.history.push(userOp);
        },
        update(index: number, userOp: UserOp) {
            this.history[index] = userOp;
        },
    },
});