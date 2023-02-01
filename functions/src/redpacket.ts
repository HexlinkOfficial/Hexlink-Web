/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";

import {getRedPacket} from "./graphql/redpacket";
import type {RedPacket} from "./graphql/redpacket";
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

const secrets = functions.config().doppler || {};

async function sign(signer: string, message: string) : Promise<string> {
  const validator = new ethers.Wallet(secrets.HARDHAT_VALIDATOR);
  const keyType = KMS_KEY_TYPE[KMS_KEY_TYPE.validator];
  const kmsValidator = kmsConfig().get(keyType)!.publicAddress;
  if (signer.toLowerCase() == validator.address.toLowerCase()) {
    return await validator.signMessage(
        ethers.utils.arrayify(message)
    );
  } else if (signer.toLowerCase() == kmsValidator.toLowerCase()) {
    return await signWithKmsKey(
        keyType,
        toEthSignedMessageHash(message)
    ) as string;
  } else {
    throw new Error("invalid validator");
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
  const args = {
    creator: redPacket.metadata.creator,
    packet: {
      token: redPacket.metadata.token,
      salt: redPacket.metadata.salt,
      balance: EthBigNumber.from(redPacket.metadata.tokenAmount),
      validator: redPacket.metadata.validator,
      split: redPacket.metadata.split,
      mode: redPacketMode(redPacket.metadata.mode),
    },
    claimer,
    signature: await sign(redPacket.metadata.validator, message),
  };
  const callData = redPacketInterface.encodeFunctionData( "claim", [args]);
  return {
    to: redPacketAddress(chain),
    value: ethers.utils.hexValue(0),
    callData,
    callGasLimit: "0",
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

      const op = await buildClaimOp(chain, redPacket, account.address);
      const action = {
        type: "insert_redpacket_claim",
        params: {
          redPacketId: redPacket.id,
          creatorId: redPacket.user_id,
          claimerId: uid,
          claimer: data.claimer,
        },
      };
      try {
        const result = await submit(chain, {
          type: "claim_redpacket",
          op,
          account: account.address,
          userId: uid,
          actions: [action],
        });
        return {code: 200, id: result.id};
      } catch (err: any) {
        console.log("Failed to submit op");
        console.log(err);
        return {code: 400, message: "failed to submit operation"};
      }
    }
);

async function buildCreateOp(
    chain: Chain,
    redPacket: RedPacket,
) {
  const args = {
    token: redPacket.metadata.token,
    salt: redPacket.metadata.salt,
    balance: EthBigNumber.from(redPacket.metadata.tokenAmount),
    validator: redPacket.metadata.validator,
    split: redPacket.metadata.split,
    mode: redPacketMode(redPacket.metadata.mode),
  };
  const callData = redPacketInterface.encodeFunctionData("create", [args]);
  return {
    to: redPacketAddress(chain),
    value: ethers.utils.hexValue(0),
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
      const action = {
        type: "insert_redpacket",
        params: {
          userId: uid,
          redPacketId: redpacketId(chain, account.address, data.redPacket),
          creator: data.creator,
          refunder: Refunders[chain.name],
        },
      };
      const postData: any = {
        type: "create_redpacket",
        userId: uid,
        actions: [action],
        account: account.address,
        op: buildCreateOp(chain, data.redPacket),
      };
      if (data.txHash) {
        postData.tx = data.txHash;
      }
      try {
        const result = await submit(chain, postData);
        return {code: 200, id: result.id};
      } catch (err: any) {
        console.log("Failed to submit op");
        console.log(err);
        return {code: 400, message: "failed to submit operation"};
      }
    }
);
