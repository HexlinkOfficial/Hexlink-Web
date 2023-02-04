/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";

import {getRedPacket} from "./graphql/redpacket";
import type {RedPacket} from "./graphql/redpacket";
import type {RedPacket as RedPacketInput} from "../redpacket";
import {signWithKmsKey} from "./kms";
import {
  ethers,
  BigNumber as EthBigNumber,
} from "ethers";
import {
  accountAddress,
  toEthSignedMessageHash,
} from "./account";
import {KMS_KEY_TYPE, Refunders, kmsConfig} from "./config";

import {
  redPacketAddress,
  redPacketInterface,
  redPacketMode,
  redpacketId,
} from "../redpacket";
import {Firebase} from "./firebase";
import {getChain} from "../common";
import type {Chain} from "../common";
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
) {
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
      balance: EthBigNumber.from(redPacket.metadata.balance),
      validator: redPacket.metadata.validator,
      split: redPacket.metadata.split,
      mode: redPacket.metadata.mode,
    },
    claimer,
    signature,
  };
  const callData = redPacketInterface.encodeFunctionData("claim", [args]);
  return {
    to: redPacketAddress(chain),
    value: "0x0",
    callData,
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
      const account = await accountAddress(chain, uid);
      if (!account.address) {
        return {code: 400, message: "invalid account"};
      }

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

async function buildCreateOp(chain: Chain, redPacket: RedPacketInput) {
  const args = {
    token: redPacket.token.address,
    salt: redPacket.salt,
    balance: redPacket.balance,
    validator: redPacket.validator,
    split: redPacket.split,
    mode: redPacketMode(redPacket.mode),
  };
  const callData = redPacketInterface.encodeFunctionData("create", [args]);
  return {
    to: redPacketAddress(chain),
    value: "0",
    callData,
    callGasLimit: "0",
  };
}

export const createRedPacket = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized"};
      }
      const chain = getChain(data.chain);
      const account = await accountAddress(chain, uid);
      if (!account.address) {
        return {code: 400, message: "invalid account"};
      }
      const rpId = redpacketId(chain, account.address, data.redPacket);
      const action = {
        type: "insert_redpacket",
        params: {
          userId: uid,
          redPacketId: rpId,
          creator: data.creator,
          refunder: Refunders[chain.name],
        },
      };
      const [{id: reqId}] = await insertRequest(
          uid,
          [{
            to: redPacketAddress(chain),
            args: {
              redPacketId: rpId,
              metadata: {
                token: data.redPacket.token.address,
                salt: data.redPacket.salt,
                balance: data.redPacket.balance.toString(),
                split: data.redPacket.split,
                mode: redPacketMode(data.redPacket.mode),
                validator: data.redPacket.validator,
              },
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
        postData.input = await buildCreateOp(chain, data.redPacket);
      }

      const result = await submit(chain, postData);
      return {code: 200, id: result.id};
    }
);
