import { defineStore } from 'pinia';
import { useChainStore } from './chain';

export interface Erc20Transfer {
    receipt?: string;
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

export interface UserOp {
    userOpHash: string;
    type: string,
    metadata: any,
    status: "pending" | "failed" | "success";
    sentAt: Date;
    updatedAt: Date;
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
            if (state.histories[c.name] == undefined) {
                return state.histories[c.name] = []
            }
            return state.histories[c.name];
        },
    },
    actions: {
        add(userOp: UserOp) {
            this.history.push(userOp);
        },
        update(index: number, userOp: UserOp) {
            this.history[index] = userOp;
        },
        reset() {
            this.histories = {};
        }
    },
});