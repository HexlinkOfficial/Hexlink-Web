/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";

import {
  RedPacketMetadata,
  getRedPacket,
  isClaimed,
} from "./graphql/redpacket";
import type {RedPacket} from "./graphql/redpacket";
import {signWithKmsKey} from "./kms";
import {ethers} from "ethers";
import {getInfuraProvider, toEthSignedMessageHash} from "./account";
import {KMS_KEY_TYPE, kmsConfig} from "./config";

import {
  redPacketAddress,
  redPacketInterface,
  redpacketId,
  redpacketErc721Id,
  tokenFactoryAddress,
  hexlinkErc721Interface,
} from "../redpacket";
import {refunder, matchTotpCode} from "../common";
import type {Chain, OpInput} from "../common";
import {submit} from "./services/operation";
import {insertRequest} from "./graphql/request";
import {RequestData, preprocess, validateAndBuildUserOp} from "./operation";

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

async function buildClaimErc20Op(
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
  const metadata = redPacket.metadata as RedPacketMetadata;
  const args = {
    creator: metadata.creator,
    packet: {
      token: metadata.token,
      salt: metadata.salt,
      balance: metadata.balance,
      validator: metadata.validator,
      split: metadata.split,
      mode: metadata.mode,
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

async function buildMintErc721Op(
    chain: Chain,
    redPacket: RedPacket,
    claimer: string,
) : Promise<OpInput> {
  const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
          ["uint256", "address", "address"],
          [chain.chainId, redPacket.metadata.token, claimer]
      )
  );
  const signature = await sign(redPacket.metadata.validator, message);
  return {
    to: redPacket.metadata.token,
    value: "0x0",
    callData: hexlinkErc721Interface().encodeFunctionData("mint", [claimer, signature]),
    callGasLimit: "0x0",
  };
}

function validateRedPacket(
    redPacket: RedPacket,
    secret: string
) : boolean {
  const validationRules = redPacket.metadata.validationRules || [];
  const validationData = redPacket.validationData || [];
  // eslint-disable-next-line guard-for-in
  for (const index in validationRules) {
    const rule = validationRules[index];
    const data = validationData[index];
    if (rule.type === "dynamic_secrets") {
      return matchTotpCode(data.secret, secret);
    }
  }
  return true;
}

export const claimRedPacket = functions.https.onCall(
    async (data, context) => {
      const result = await preprocess(data, context);
      if (result.code !== 200) {
        return result;
      }
      const {uid, account, chain} = result as RequestData;

      const redPacket = await getRedPacket(data.redPacketId);
      if (!redPacket) {
        return {code: 400, message: "redpacket_not_found"};
      }

      const provider = getInfuraProvider(chain);
      let input;
      if (redPacket.type === "erc20") {
        input = await buildClaimErc20Op(chain, redPacket, account.address);
      } else {
        input = await buildMintErc721Op(chain, redPacket, account.address);
      }

      if (!validateRedPacket(redPacket, data.secret)) {
        return {code: 422, message: "input_validation_error"};
      }
      if (await isClaimed(redPacket.id, uid)) {
        return {code: 422, message: "already_claimed"};
      }
      try {
        await provider.estimateGas({
          to: input.to,
          data: input.callData,
          value: input.value,
        });
      } catch {
        return {code: 422, message: "tx_validation_error"};
      }

      const action = {
        type: "insert_redpacket_claim",
        params: {
          redPacketId: redPacket.id,
          token: redPacket.metadata.token,
          creatorId: redPacket.user_id,
          claimerId: uid,
          claimer: data.claimer,
          type: redPacket.type,
        },
      };
      const [{id: reqId}] = await insertRequest(
          uid,
          [{
            to: redPacketAddress(chain),
            args: {
              redPacketId: redPacket.id,
              token: redPacket.metadata.token,
            },
          }]
      );
      const resp = await submit(chain, {
        type: "claim_redpacket",
        input,
        account: account.address,
        userId: uid,
        actions: [action],
        requestId: reqId,
      });
      return {code: 200, id: resp.id};
    }
);

export const createRedPacket = functions.https.onCall(
    async (data, context) => {
      const result = await preprocess(data, context);
      if (result.code !== 200) {
        return result;
      }
      const {uid, account, chain} = result as RequestData;

      const rpId = redpacketId(chain, account.address, data.redPacket);
      const action = {
        type: "insert_redpacket",
        params: {
          userId: uid,
          redPacketId: rpId,
          creator: data.creator,
          refunder: refunder(chain),
          priceInfo: data.redPacket.priceInfo,
          validationRules: data.redPacket.validationRules,
        },
      };
      const [{id: reqId}] = await insertRequest(
          uid,
          [{
            to: redPacketAddress(chain),
            args: {
              redPacketId: rpId,
              metadata: data.redPacket,
              type: "erc20",
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
      const resp = await submit(chain, postData);
      return {code: 200, id: resp.id};
    }
);

export const createRedPacketErc721 = functions.https.onCall(
    async (data, context) => {
      const result = await preprocess(data, context);
      if (result.code !== 200) {
        return result;
      }
      const {uid, account, chain} = result as RequestData;
      const rpId = redpacketErc721Id(chain, account.address, data.erc721);
      const salt = ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
              ["address", "bytes32"],
              [account.address, data.erc721.salt]
          )
      );
      const action = {
        type: "insert_redpacket_erc721",
        params: {
          userId: uid,
          redPacketId: rpId,
          salt,
          creator: data.creator,
          refunder: refunder(chain),
          priceInfo: data.erc721.priceInfo,
          validationRules: data.erc721.validationRules,
        },
      };
      const [{id: reqId}] = await insertRequest(
          uid,
          [{
            to: tokenFactoryAddress(chain),
            args: {
              redPacketId: rpId,
              metadata: data.erc721,
              type: "erc721",
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
        try {
          const provider = getInfuraProvider(chain);
          await provider.estimateGas({
            to: postData.input.to,
            data: postData.input.callData,
            value: postData.input.value,
          });
        } catch {
          return {code: 422, message: "tx_validation_error"};
        }
      }
      const resp = await submit(chain, postData);
      return {code: 200, id: resp.id};
    }
);
