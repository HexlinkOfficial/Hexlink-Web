/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";

import {
  RedPacketMetadata,
  getRedPacket,
  isClaimed,
  getRedPacketValidation,
} from "./graphql/redpacket";
import type {RedPacket} from "./graphql/redpacket";
import {signWithKmsKey} from "./kms";
import {ethers} from "ethers";
import {getProvider, toEthSignedMessageHash} from "./account";
import {KMS_KEY_TYPE, kmsConfig} from "./config";

import {
  redPacketAddress,
  redPacketInterface,
  redpacketId,
  redpacketErc721Id,
  tokenFactoryAddress,
  hexlinkErc721Interface,
  redPacketContract,
  hexlinkErc721Contract,
} from "../redpacket";
import {refunder, genTotpCode, matchTotpCode} from "../common";
import type {Chain, OpInput} from "../common";
import {submit} from "./services/operation";
import {insertRequest} from "./graphql/request";
import {RequestData, preprocess, validateAndBuildUserOp} from "./operation";
import {rateLimiter} from "./ratelimiter";

const secrets = functions.config().doppler || {};

async function sign(signer: string, message: string) : Promise<string> {
  const validator = new ethers.Wallet(secrets.HARDHAT_VALIDATOR);
  if (signer.toLowerCase() == validator.address.toLowerCase()) {
    return await validator.signMessage(ethers.utils.arrayify(message));
  } else {
    const keyType = KMS_KEY_TYPE[KMS_KEY_TYPE.validator];
    const kmsValidator = kmsConfig().get(keyType)!.publicAddress!;
    if (signer.toLowerCase() == kmsValidator.toLowerCase()) {
      return await signWithKmsKey(
          keyType,
          toEthSignedMessageHash(message)
      ) as string;
    } else {
      throw new Error(`invalid validator, signer is ${signer}, kms validator is ${kmsValidator}`);
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
          ["bytes32", "address", "address"],
          [redPacket.id, claimer, refunder(chain)]
      )
  );
  const signature = await sign(redPacket.metadata.validator, message);
  const metadata = redPacket.metadata as RedPacketMetadata;
  const packet = {
    creator: metadata.creator,
    token: metadata.token,
    salt: metadata.salt,
    balance: metadata.balance,
    validator: metadata.validator,
    split: metadata.split,
    mode: metadata.mode,
    sponsorGas: true,
  };
  return {
    to: redPacketAddress(chain),
    value: "0x0",
    callData: redPacketInterface.encodeFunctionData("claim", [
      packet, claimer, refunder(chain), signature,
    ]),
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
          ["uint256", "address", "address", "address"],
          [chain.chainId, redPacket.metadata.token, claimer, refunder(chain)]
      )
  );
  const signature = await sign(redPacket.metadata.validator, message);
  return {
    to: redPacket.metadata.token,
    value: "0x0",
    callData: hexlinkErc721Interface.encodeFunctionData(
        "mint",
        [claimer, refunder(chain), signature]
    ),
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

export const claimCountdown = functions.https.onCall(
    async (data, context) => {
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized"};
      }
      const validation = await getRedPacketValidation(data.redPacketId);
      const filtered = validation.filter((v: any) => v.type === "dynamic_secrets");
      if (filtered.length == 0) {
        return {code: 400, message: "dynamic secret is not enabled for this airdrop"};
      }
      const now = new Date().getTime();
      const epoch = Math.floor(now / 1000.0);
      const toExpire = 60 - epoch % 60;
      const secret = filtered[0].secret;
      if (data.code === genTotpCode(secret)) {
        return {code: 200, countdown: 60 + toExpire};
      } else if (data.code === genTotpCode(secret, now - 60000)) {
        return {code: 200, countdown: toExpire};
      } else {
        return {code: 200, countdown: 0};
      }
    }
);

export const claimRedPacket = functions.https.onCall(
    async (data, context) => {
      const result = await preprocess(data, context);
      if (result.code !== 200) {
        return result;
      }
      const {uid, account, chain} = result as RequestData;

      const isQuotaExceeded = await rateLimiter("claimRedPacket", `uid_${uid}`, 10, 1);
      if (isQuotaExceeded) {
        return {code: 429, message: "Too many requests of claimRedPacket."};
      }

      const redPacket = await getRedPacket(data.redPacketId);
      if (!redPacket) {
        return {code: 400, message: "redpacket_not_found"};
      }

      const provider = getProvider(chain);
      let input;
      let to : string;
      if (redPacket.type === "erc20") {
        input = await buildClaimErc20Op(chain, redPacket, account.address);
        to = redPacketAddress(chain);
      } else {
        input = await buildMintErc721Op(chain, redPacket, account.address);
        to = redPacket.metadata.token;
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
          creatorId: redPacket.userId,
          claimerId: uid,
          claimer: data.claimer,
          type: redPacket.type,
        },
      };
      const [{id: reqId}] = await insertRequest(
          uid,
          [{
            to,
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

      const isQuotaExceeded = await rateLimiter("createRedPacket", `uid_${uid}`, 60, 3);
      if (isQuotaExceeded) {
        return {code: 429, message: "Too many requests of createRedPacket."};
      }

      const rpId = redpacketId(chain, data.redPacket);
      const action = {
        type: "insert_redpacket",
        params: {
          userId: uid,
          redPacketId: rpId,
          creator: data.creator,
          refunder: refunder(chain),
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

      const isQuotaExceeded = await rateLimiter("createRedPacketErc721", `uid_${uid}`, 60, 3);
      if (isQuotaExceeded) {
        return {code: 429, message: "Too many requests of createRedPacketErc721."};
      }

      const rpId = redpacketErc721Id(chain, data.erc721);
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
          const provider = getProvider(chain);
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

export const refundRedPacket = functions.https.onCall(
    async (data, context) => {
      const result = await preprocess(data, context);
      if (result.code !== 200) {
        return result;
      }
      const {uid, account, chain} = result as RequestData;
      const isQuotaExceeded = await rateLimiter("refundRedPacket", `uid_${uid}`, 10, 1);
      if (isQuotaExceeded) {
        return {code: 429, message: "Too many requests of refundRedPacket."};
      }

      const redPacket = await getRedPacket(data.redPacketId);
      if (!redPacket) {
        return {code: 400, message: "redpacket_not_found"};
      }
      if (redPacket.userId !== uid) {
        return {code: 401, message: "Not authorized"};
      }

      const provider = getProvider(chain);
      let to;
      if (redPacket.type === "erc20") {
        const contract = await redPacketContract(provider);
        const state = await contract.getPacket(redPacket.id);
        if (state.balance.eq(0) && state.gasSponsorship.eq(0)) {
          return {code: 400, message: "redpacket_already_funded"};
        }
        to = redPacketAddress(chain);
      } else {
        const contract = await hexlinkErc721Contract(
            redPacket.metadata.token, provider
        );
        if ((await contract.gasSponsorship()).eq(0)) {
          return {code: 400, message: "redpacket_already_funded"};
        }
        to = redPacket.metadata.token;
      }

      const input = await validateAndBuildUserOp(
          chain, account, data.request
      );
      try {
        await provider.estimateGas({
          to: input.to,
          data: input.callData,
          value: input.value,
        });
      } catch {
        return {code: 422, message: "tx_validation_error"};
      }

      const [{id: reqId}] = await insertRequest(
          uid,
          [{
            to,
            args: {redPacketId: redPacket.id},
          }]
      );
      const resp = await submit(chain, {
        type: "refund_redpacket",
        input,
        account: account.address,
        userId: uid,
        actions: [],
        requestId: reqId,
      });
      return {code: 200, id: resp.id};
    }
);
