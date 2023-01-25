import { BigNumber as EthBigNumber } from "ethers";
export interface UserOpInput {
    to: string;
    value: EthBigNumber;
    callData: string | any[];
    callGasLimit: EthBigNumber;
}
export interface UserOp {
    name: string;
    function: string;
    args: any[];
    input: UserOpInput;
}
export interface GasObject {
    receiver: string;
    token: string;
    base: EthBigNumber;
    price: EthBigNumber;
}
export interface TransactionInput {
    to: string;
    from: string;
    value: string;
    data: string | any[];
}
export interface Transaction {
    name: string;
    function: string;
    args: any[];
    input: TransactionInput;
}
