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
    encodeValidateAndCall,
    hash,
    isNativeCoin,
    hexlContract,
    getGasCost,
} from "../../../functions/common/";
import { hexlinkSwapAddress } from "../../../functions/redpacket/";
import { genDeployAuthProof } from "./oracle";
import { signMessage } from "./wallet";
import { useWalletStore } from "@/stores/wallet";
import { nameHashWithVersion } from "@/web3/account";

import { getFunctions, httpsCallable } from '@firebase/functions'
import { getProvider } from "./network";

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
    const gas = {
        swapper: hexlinkSwapAddress(chain),
        token: gasToken,
        receiver: refunder(chain),
        baseGas: deployed ? "0" : getGasCost(chain, "deploy"),
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

async function addressOf(chain: Chain, receipt: Name) {
    if (receipt.schema) {
        const nameHash = nameHashWithVersion(receipt.schema, receipt.name);
        const hexl = await hexlContract(getProvider(chain));
        return await hexl.addressOfName(nameHash);
    }
    return receipt.name;
}

export async function sendToken(
    token: string,
    to: Name[],
    amount: string,
    gasToken: string,
    dryrun?: boolean,
) : Promise<{opId: number}> {
    const chain = useChainStore().chain;
    const parsedAddresses = await Promise.all(
        to.map(t => addressOf(chain, t))
    );
    const ops = buildSendTokenRequestOps(
        chain,
        token,
        parsedAddresses,
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
        accountVersion: useAccountStore().version,
    });
    return {
        opId: (result.data as any).id
    };
}