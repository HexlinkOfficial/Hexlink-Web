import { BigNumber as EthBigNumber } from "ethers";
export type BigNumberish = string | number | EthBigNumber;
export interface OpInput {
    to: string;
    value: BigNumberish;
    callData: string | [];
    callGasLimit: BigNumberish;
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
    swapper: string;
    receiver: string;
    token: string;
    baseGas?: BigNumberish;
}
export interface UserOpRequest {
    txData: string;
    nonce: BigNumberish;
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
