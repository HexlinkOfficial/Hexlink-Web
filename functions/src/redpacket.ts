/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";

import {getRedPacket} from "./graphql/redpacket";
import type {RedPacket} from "./graphql/redpacket";
import {signWithKmsKey} from "./kms";
import {ethers, BigNumber as EthBigNumber} from "ethers";
import {
  accountAddress,
  getInfuraProvider,
  toEthSignedMessageHash,
} from "./account";
import type {Error, GenAddressSuccess} from "./account";
import {KMS_KEY_TYPE, kmsConfig} from "./config";

import {
  redPacketAddress,
  redPacketInterface,
  redpacketId,
} from "../redpacket";
import {Firebase} from "./firebase";
import {
  UserOpRequest,
  accountInterface,
  getChain,
  PriceConfigs,
  gasTokenPricePerGwei,
  refunder,
  isContract,
  hexlInterface,
  hexlAddress,
  DEPLOYMENT_GASCOST,
} from "../common";
import type {Chain, GasObject, OpInput, DeployRequest} from "../common";
import {submit} from "./services/operation";
import {insertRequest} from "./graphql/request";

const secrets = functions.config().doppler || {};

async function sign(signer: string, message: string) : Promise<string> {
  const validator = new ethers.Wallet(secrets.HARDHAT_VALIDATOR);
  if (signer.toLowerCase() == validator.address.toLowerCase()) {
    return await validator.signMessage(ethers.utils.arrayify(message));
  } else {
    const keyType = KMS_KEY_TYPE[KMS_KEY_TYPE.validator];
    const kmsValidator = kmsConfig().get(keyType)!.publicAddress;
    if (signer.toLowerCase() == kmsValidator.toLowerCase()) {
      return await signWithKmsKey(
          keyType,
          toEthSignedMessageHash(message)
      ) as string;
    } else {
      throw new Error("invalid validator");
    }
  }
}

async function buildClaimOp(
    chain: Chain,
    redPacket: RedPacket,
    claimer: string,
) : Promise<OpInput> {
  const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "address"],
          [redPacket.id, claimer]
      )
  );
  const signature = await sign(redPacket.metadata.validator, message);
  const args = {
    creator: redPacket.metadata.creator,
    packet: {
      token: redPacket.metadata.token,
      salt: redPacket.metadata.salt,
      balance: redPacket.metadata.balance,
      validator: redPacket.metadata.validator,
      split: redPacket.metadata.split,
      mode: redPacket.metadata.mode,
    },
    claimer,
    signature,
  };
  return {
    to: redPacketAddress(chain),
    value: "0x0",
    callData: redPacketInterface.encodeFunctionData("claim", [args]),
    callGasLimit: "0x0",
  };
}

export const claimRedPacket = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized"};
      }

      const chain = getChain(data.chain);
      let account =
        await accountAddress(chain, uid, data.version);
      if (account.code !== 200) {
        return {code: 400, message: "invalid account"};
      }
      account = account as GenAddressSuccess;

      const redPacket = await getRedPacket(data.redPacketId);
      if (!redPacket) {
        return {code: 400, message: "Failed to load redpacket"};
      }

      const input = await buildClaimOp(chain, redPacket, account.address);
      const action = {
        type: "insert_redpacket_claim",
        params: {
          redPacketId: redPacket.id,
          creatorId: redPacket.user_id,
          claimerId: uid,
          claimer: data.claimer,
        },
      };
      const [{id: reqId}] = await insertRequest(
          uid,
          [{
            to: redPacketAddress(chain),
            args: {
              redPacketId: redPacket.id,
            },
          }]
      );
      const result = await submit(chain, {
        type: "claim_redpacket",
        input,
        account: account.address,
        userId: uid,
        actions: [action],
        requestId: reqId,
      });
      return {code: 200, id: result.id};
    }
);

function validateGas(chain: Chain, gas: GasObject, deployed: boolean) {
  if (gas.receiver !== refunder(chain)) {
    throw new Error("invalid gas refunder");
  }
  const price = gasTokenPricePerGwei(
      chain, gas.token, PriceConfigs[chain.name]
  );
  if (!deployed && EthBigNumber.from(gas.baseGas).lt(DEPLOYMENT_GASCOST)) {
    throw new Error("insufficient base gas for deployment");
  }
  if (EthBigNumber.from(gas.price).lt(price)) {
    throw new Error("invalid gas price");
  }
}

async function validateAndBuildUserOp(
    chain: Chain,
    account: GenAddressSuccess,
    request: {
      redpacket: UserOpRequest,
      deploy?: DeployRequest,
    },
) : Promise<OpInput> {
  const req = request.redpacket;
  const data = accountInterface.encodeFunctionData(
      "validateAndCallWithGasRefund",
      [req.txData, req.nonce, req.signature, req.gas]
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

export const createRedPacket = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized"};
      }
      const chain = getChain(data.chain);
      let account = await accountAddress(chain, uid, data.version);
      if (account.code !== 200) {
        return {code: 400, message: (account as Error).message};
      }
      account = account as GenAddressSuccess;

      const rpId = redpacketId(chain, account.address, data.redPacket);
      const action = {
        type: "insert_redpacket",
        params: {
          userId: uid,
          redPacketId: rpId,
          creator: data.creator,
          refunder: refunder(chain),
          priceInfo: data.redPacket.priceInfo,
        },
      };
      const [{id: reqId}] = await insertRequest(
          uid,
          [{
            to: redPacketAddress(chain),
            args: {
              redPacketId: rpId,
              metadata: data.redPacket,
            },
          }]
      );
      const postData: any = {
        type: "create_redpacket",
        userId: uid,
        actions: [action],
        account: account.address,
        requestId: reqId,
      };
      if (data.txHash) {
        postData.tx = data.txHash;
      } else {
        postData.input = await validateAndBuildUserOp(
            chain, account, data.request
        );
      }
      const result = await submit(chain, postData);
      return {code: 200, id: result.id};
    }
);
