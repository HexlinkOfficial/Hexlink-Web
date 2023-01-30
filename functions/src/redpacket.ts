/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";

import {insertRedPacketClaim, getRedPacket} from "./graphql/redpacket";
import type {RedPacket} from "./graphql/redpacket";
import {signWithKmsKey} from "./kms";
import {
  ethers,
  BigNumber as EthBigNumber,
  Signature,
  PopulatedTransaction,
} from "ethers";
import {
  getInfuraProvider,
  accountAddress,
  toEthSignedMessageHash,
} from "./account";
import {resolveProperties} from "@ethersproject/properties";
import {serialize, UnsignedTransaction} from "@ethersproject/transactions";
import {KMS_KEY_TYPE} from "./config";

import {redPacketContract, redPacketMode} from "../redpacket";
import {Firebase} from "./firebase";
import {PriceConfig} from "../common";

const secrets = functions.config().doppler || {};

async function signRaw(signer: string, message: string) : Promise<Signature> {
  const validator = new ethers.Wallet(secrets.HARDHAT_VALIDATOR);
  if (signer == validator.address) {
    return validator._signingKey().signDigest(message);
  } else {
    return await signWithKmsKey(
        KMS_KEY_TYPE[KMS_KEY_TYPE.validator],
        message,
        false
    ) as Signature;
  }
}

async function sign(signer: string, message: string) : Promise<string> {
  const validator = new ethers.Wallet(secrets.HARDHAT_VALIDATOR);
  if (signer == validator.address) {
    return await validator.signMessage(
        ethers.utils.arrayify(message)
    );
  } else {
    return await signWithKmsKey(
        KMS_KEY_TYPE[KMS_KEY_TYPE.validator],
        toEthSignedMessageHash(message)
    ) as string;
  }
}

async function buildTx(
    provider: ethers.providers.Provider,
    unsignedTx: PopulatedTransaction,
    validator: string
) : Promise<ethers.PopulatedTransaction> {
  const {chainId} = await provider.getNetwork();
  unsignedTx.chainId = chainId;
  unsignedTx.from = validator;
  unsignedTx.type = 2;
  unsignedTx.nonce = await provider.getTransactionCount(unsignedTx.from);
  unsignedTx.gasLimit = EthBigNumber.from(500000);
  const feeData = await provider.getFeeData();
  unsignedTx.maxPriorityFeePerGas =
    feeData.maxPriorityFeePerGas || EthBigNumber.from(0);
  const defaultGasPrice = EthBigNumber.from(
      PriceConfig[chainId.toString()].gasPrice);
  unsignedTx.maxFeePerGas =
    feeData.maxFeePerGas || feeData.maxPriorityFeePerGas?.add(defaultGasPrice);
  return unsignedTx;
}

export async function buildClaimTx(
    provider: ethers.providers.Provider,
    redPacket: RedPacket,
    data: {chainId: string, claimerAddress: string, creator?: string},
) : Promise<string> {
  const {metadata} = redPacket;
  const creator = metadata.creator || data.creator;
  const contract = await redPacketContract(provider);
  let unsignedTx = await contract.populateTransaction.claim({
    creator,
    packet: {
      token: metadata.token,
      salt: metadata.salt,
      balance: EthBigNumber.from(metadata.tokenAmount),
      validator: metadata.validator,
      split: metadata.split,
      mode: redPacketMode(metadata.mode),
    },
    claimer: data.claimerAddress,
    signature: [],
  });
  unsignedTx = await buildTx(provider, unsignedTx, metadata.validator);
  const tx = await resolveProperties(unsignedTx);
  const signature = await signRaw(
      metadata.validator,
      ethers.utils.keccak256(serialize(<UnsignedTransaction>tx))
  );
  return serialize(<UnsignedTransaction>tx, signature);
}

export const claimRedPacket = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized"};
      }
      const account = await accountAddress(data.chainId, uid);
      if (!account.address) {
        return account;
      }
      data.claimerAddress = account.address;
      const redPacket = await getRedPacket(data.redPacketId);
      if (!redPacket) {
        return {code: 400, message: "Failed to load redpacket"};
      }
      if (data.signOnly) {
        const message = ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(
                ["bytes32", "address"],
                [redPacket.id, data.claimerAddress]
            )
        );
        const signature = await sign(redPacket.metadata.validator, message);
        const [{id}] = await insertRedPacketClaim([{
          redPacketId: redPacket.id,
          creatorId: redPacket.user_id,
          claimerId: uid,
          claimer: data.claimer,
        }]);
        return {code: 200, id, signature};
      } else {
        const provider = getInfuraProvider(data.chainId);
        const signedTx = await buildClaimTx(provider, redPacket, data);
        const txHash = ethers.utils.keccak256(signedTx);
        await provider.sendTransaction(signedTx);
        const [{id}] = await insertRedPacketClaim([{
          redPacketId: redPacket.id,
          creatorId: redPacket.user_id,
          claimerId: uid,
          claimer: data.claimer,
          tx: txHash,
        }]);
        return {code: 200, id, tx: txHash};
      }
    }
);
