/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";

import {
  insertRedPacketClaim,
  getRedPacket,
  updateRedPacketClaim,
} from "./graphql/redpacket";
import type {RedPacket, RedPacketClaimInput} from "./graphql/redpacket";
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

import {
  redPacketContract,
  redPacketAddress,
  redPacketInterface,
  redPacketMode,
} from "../redpacket";
import {Firebase} from "./firebase";
import {PriceConfig, getChain} from "../common";
import type {Chain} from "../common";
import {submit} from "./services/operation";

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
      PriceConfig[getChain(chainId).name].gasPrice);
  unsignedTx.maxFeePerGas =
    feeData.maxFeePerGas || feeData.maxPriorityFeePerGas?.add(defaultGasPrice);
  return unsignedTx;
}

export async function buildClaimTx(
    provider: ethers.providers.Provider,
    redPacket: RedPacket,
    data: {claimerAddress: string, creator?: string},
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

async function buildClaimOp(
    chain: Chain,
    redPacket: RedPacket,
    claimer: string,
    action: any,
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
    op: {
      to: redPacketAddress(chain),
      value: ethers.utils.hexValue(0),
      callData,
      callGasLimit: "0",
    },
    args,
    actions: [action],
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
        return account;
      }
      const redPacket = await getRedPacket(data.redPacketId);
      if (!redPacket) {
        return {code: 400, message: "Failed to load redpacket"};
      }

      const claimInput : RedPacketClaimInput = {
        redPacketId: redPacket.id,
        creatorId: redPacket.user_id,
        claimerId: uid,
        claimer: data.claimer,
      };
      if (data.serverUpdate) {
        const [{id: claimId}] = await insertRedPacketClaim([claimInput]);
        const action = {
          actions: {
            type: "claim_redpacket",
            params: {
              claimer: account.address,
              claimId,
              redPacketId: redPacket.id,
            },
          },
        };
        const postData = await buildClaimOp(
            chain, redPacket, account.address, action
        );
        try {
          const result = await submit(chain, postData);
          await updateRedPacketClaim(claimId, result.id);
          return {code: 200, id: result.id};
        } catch (err: any) {
          console.log("Failed to submit op");
          console.log(err);
          await updateRedPacketClaim(claimId, undefined, "failed to submit op");
          return {code: 400, message: "failed to submit operation"};
        }
      } else {
        const provider = getInfuraProvider(chain);
        data.claimerAddress = account.address;
        const signedTx = await buildClaimTx(provider, redPacket, data);
        const txHash = ethers.utils.keccak256(signedTx);
        await provider.sendTransaction(signedTx);
        claimInput.tx = txHash;
        const [{id}] = await insertRedPacketClaim([claimInput]);
        return {code: 200, id, tx: txHash};
      }
    }
);
