import * as functions from "firebase-functions";

import {BigNumber as EthBigNumber} from "ethers";
import {Firebase} from "./firebase";
import {
  Chain,
  DEPLOYMENT_GASCOST,
  DeployRequest,
  GasObject,
  OpInput,
  UserOpRequest,
  accountInterface,
  getChain,
  hexlAddress,
  hexlInterface,
  isContract,
  refunder,
  isAllowedGasToken,
} from "../common";
import {hexlinkSwapAddress} from "../redpacket";
import {accountAddress, getInfuraProvider} from "./account";
import type {Error, GenAddressSuccess} from "./account";
import {submit} from "./services/operation";
import {insertRequest} from "./graphql/request";

export interface RequestData {
    uid: string;
    chain: Chain;
    account: GenAddressSuccess;
}

export async function preprocess(data: any, context: any) {
  Firebase.getInstance();
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }
  const chain = getChain(data.chain);
  let account = await accountAddress(chain, uid, data.accountVersion);
  if (account.code !== 200) {
    return {code: 400, message: (account as Error).message};
  }
  account = account as GenAddressSuccess;
  return {code: 200, chain, account, uid};
}

export function validateGas(chain: Chain, gas: GasObject, deployed: boolean) {
  if (gas.swapper !== hexlinkSwapAddress(chain)) {
    throw new Error("unsupported swapper");
  }
  if (gas.receiver !== refunder(chain)) {
    throw new Error("invalid gas refund receiver");
  }
  if (!isAllowedGasToken(gas.token, chain)) {
    throw new Error("invalid gas token");
  }
  if (!deployed && EthBigNumber.from(gas.baseGas).lt(DEPLOYMENT_GASCOST)) {
    throw new Error("insufficient base gas for deployment");
  }
}

export async function validateAndBuildUserOp(
    chain: Chain,
    account: GenAddressSuccess,
    request: {
        params: UserOpRequest,
        deploy?: DeployRequest,
      },
) : Promise<OpInput> {
  const req = request.params;
  const data = accountInterface.encodeFunctionData(
      "validateAndCallWithGasRefund",
      [req.txData, req.nonce, req.gas, req.signature]
  );
  const provider = getInfuraProvider(chain);
  const deployed = await isContract(provider, account.address);
  validateGas(chain, req.gas, deployed);
  if (deployed) {
    return {
      to: account.address,
      value: "0x0",
      callData: data,
      callGasLimit: "0x0",
    };
  } else {
    if (!request.deploy) {
      throw new Error("invalid param, missing deploy request params");
    }
    const deployData = hexlInterface.encodeFunctionData(
        "deploy", [
          account.nameHash,
          accountInterface.encodeFunctionData(
              "init", [request.deploy.owner, data]
          ),
          request.deploy.authProof,
        ]
    );
    return {
      to: hexlAddress(chain),
      value: "0x0",
      callData: deployData,
      callGasLimit: "0x0",
    };
  }
}

export const sendToken = functions.https.onCall(
    async (data, context) => {
      const result = await preprocess(data, context);
      if (result.code !== 200) {
        return result;
      }
      const {uid, account, chain} = result as RequestData;
      const [{id: reqId}] = await insertRequest(
          uid,
          [{
            to: data.args.token,
            args: data.args,
          }]
      );
      const postData: any = {
        type: "send_erc20",
        userId: uid,
        actions: [],
        requestId: reqId,
        account: account.address,
        input: await validateAndBuildUserOp(
            chain, account, data.request
        ),
      };
      const resp = await submit(chain, postData);
      return {code: 200, id: resp.id};
    }
);
