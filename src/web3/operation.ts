import { useAccountStore } from "@/stores/account";
import { useChainStore } from "@/stores/chain";
import { BigNumber as EthBigNumber } from "ethers";
import {
    type UserOpRequest,
    type DeployRequest,
    type AuthProofInput,
    type OpInput,
    type Op,
    type Chain,
    erc20Interface,
    encodeExecBatch,
    accountContract,
    isContract,
    refunder,
    DEPLOYMENT_GASCOST,
    gasTokenPricePerGwei,
    encodeValidateAndCall,
    hash,
    isNativeCoin,
    nameHash,
} from "../../functions/common/";
import { genDeployAuthProof } from "./oracle";
import { signMessage } from "./wallet";
import { useWalletStore } from "@/stores/wallet";

import { getFunctions, httpsCallable } from 'firebase/functions'
import { getPriceInfo } from "./network";
const functions = getFunctions();

export function buildOpInput(params: {
    to: string,
    value?: EthBigNumber,
    callData?: string | [],
    callGasLimit?: EthBigNumber,
}) : OpInput {
    if (!params.value && !params.callData) {
        throw new Error("Neither value or data is set");
    }
    return {
        to: params.to,
        value: params.value || EthBigNumber.from(0),
        callData: params.callData || [],
        callGasLimit: params.callGasLimit || EthBigNumber.from(0),
    }
}

export async function buildUserOpRequest(
    opInputs: OpInput[],
    gasToken: string,
) : Promise<{
    params: UserOpRequest,
    deploy?: DeployRequest,
}> {
    const hexlAccount = useAccountStore().account!.address;
    const walletAccount = useWalletStore().account!.address;
    const chain = useChainStore().chain;

    const provider = useChainStore().provider;

    const txData = encodeExecBatch(opInputs);
    const account = accountContract(provider, hexlAccount);

    const deployed = await isContract(provider, hexlAccount);
    const priceInfo = await getPriceInfo(chain);
    const gas = {
        receiver: refunder(chain),
        token: gasToken,
        baseGas: deployed ? "0" : DEPLOYMENT_GASCOST,
        price: gasTokenPricePerGwei(
            chain,
            gasToken,
            priceInfo,
        )
    };
    const nonce = deployed ? await account.nonce() : 0;
    const {data, signature} = await encodeValidateAndCall({
        nonce,
        txData,
        sign: async (msg: string) => await signMessage(walletAccount, msg),
        gas,
    });
    const result = {
        params: {txData, signature, nonce, gas},
    } as { params: UserOpRequest, deploy?: DeployRequest };

    if (!deployed) {
        const { proof } = await genDeployAuthProof(data);
        const authProof = {
            authType: hash(proof.authType),
            identityType: hash(proof.identityType),
            issuedAt: EthBigNumber.from(proof.issuedAt),
            signature: proof.signature,
        } as AuthProofInput;
        result.deploy = {authProof, owner: walletAccount};
    }
    return result;
}

export function buildSendTokenRequestOp(
    chain: Chain,
    token: string,
    to: string,
    amount: string
): Op {
    if (isNativeCoin(token, chain)) {
        return {
            name: "sendToken",
            function: "",
            args: {
                token, to, amount
            },
            input: {
                to,
                callData: [],
                callGasLimit: "0",
                value: amount,
            }
        };
    } else {
        return {
            name: "sendToken",
            function: "transfer",
            args: {
                token, to, amount
            },
            input: {
                to: token,
                callData: erc20Interface.encodeFunctionData(
                    "transfer", [to, amount]
                ),
                callGasLimit: "0",
                value: "0",
            }
        };
    }
}

export function buildSendTokenRequestOps(
    chain: Chain,
    token: string,
    to: string[],
    amount: string
): Op[] {
    return to.map(
        addr => buildSendTokenRequestOp(chain, token, addr, amount)
    );
}

export interface Name {
    schema?: | "mailto" | "twitter.com";
    name: string;
}

function addressOf(receipt: Name) {
    if (receipt.schema) {
        return nameHash(receipt.schema, receipt.name);
    }
    return receipt.name;
}

export async function sendToken(
    token: string,
    to: Name[],
    amount: string,
    gasToken: string,
    dryrun?: boolean
) : Promise<{opId: number}> {
    const chain = useChainStore().chain;
    const ops = buildSendTokenRequestOps(
        chain,
        token,
        to.map(n => addressOf(n)),
        amount
    );
    const request = await buildUserOpRequest(
        ops.map(op => op.input),
        gasToken
    );
    if (dryrun) {
        console.log(request);
        return {opId: -1};
    }
    const callSendToken = httpsCallable(functions, 'sendToken');
    const result = await callSendToken({
        chain: chain.name,
        args: {
            token: token,
            amount,
            to,
        },
        request,
        version: useAccountStore().version,
    });
    return {opId: (result.data as any).id};
}