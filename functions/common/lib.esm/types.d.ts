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
    baseGas?: EthBigNumber | string;
    price: EthBigNumber | string;
}
export interface Deposit {
    ref: string;
    receipt: string;
    token: string;
    amount: string;
}
export interface UserOpRequest {
    txData: string;
    nonce: string;
    signature: string;
    gas: GasObject;
}
export interface AuthProof {
    name: string;
    requestId: string;
    authType: string;
    identityType: string;
    issuedAt: number;
    signature: string;
}
export interface AuthProofInput {
    authType: string;
    identityType: string;
    issuedAt: EthBigNumber | string | number;
    signature: string;
}
export interface DeployRequest {
    authProof: AuthProofInput;
    owner: string;
}
