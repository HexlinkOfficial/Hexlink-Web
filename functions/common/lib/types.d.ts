import { BigNumber as EthBigNumber } from "ethers";
export interface OpInput {
    to: string;
    value: EthBigNumber | string;
    callData: string | [];
    callGasLimit: EthBigNumber | string;
}
export interface Op {
    name: string;
    function: string;
    args: {
        [key: string]: any;
    };
    input: OpInput;
}
export interface GasObject {
    receiver: string;
    token: string;
    price: EthBigNumber | string;
}
export interface Deposit {
    ref: string;
    receipt: string;
    token: string;
    amount: string;
}
export interface UserOpRequest {
    params: {
        txData: string;
        nonce: string;
        signature: string;
        gas: GasObject;
    };
    data: string;
}
