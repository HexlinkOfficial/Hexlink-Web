import { defineStore } from 'pinia';
import { UserOperationStruct } from '@account-abstraction/contracts';
import { BigNumber as EthBigNumber } from "ethers";

export interface UserOpInfo {
    userOpHash: string;
    validationData: EthBigNumber;
    signer: string;
    name: string;
    nameType: string;
    signedMessage: string;
    txType: string;
    txMetadata: any;
};

export const useUserOpStore = defineStore({
    id: 'userOperation',
    state: (): {
        op: Partial<UserOperationStruct>;
        opInfo: Partial<UserOpInfo>;
    } => ({
        op: {},
        opInfo: {},
    }),
    persist: true,
    actions: {
        updateOp(userOp: Partial<UserOperationStruct>) {
            this.op = {
                ...this.op,
                ...userOp,
            };
        },
        updateOpInfo(userOpInfo: Partial<UserOpInfo>) {
            this.opInfo = {
                ...this.opInfo,
                ...userOpInfo
            }
        },
        reset() {
            this.op = {};
            this.opInfo = {};
        }
    },
});