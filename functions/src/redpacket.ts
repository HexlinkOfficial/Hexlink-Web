/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import {env} from "process";

import {insertRedPacketClaim, getRedPacket} from "./graphql/redpacket";
import {signWithKmsKey, getEthAddressFromPublicKey} from "./kms";
import {
  ethers,
  BigNumber as EthBigNumber,
  Signer,
  Signature,
  PopulatedTransaction,
} from "ethers";
import RED_PACKET_ABI from "./abi/HappyRedPacket.json";
import {
  getInfuraProvider,
  accountAddress,
  toEthSignedMessageHash,
} from "./account";
import {resolveProperties} from "@ethersproject/properties";
import {serialize, UnsignedTransaction} from "@ethersproject/transactions";
import {KMS_KEY_TYPE, PriceConfig} from "./config";

const secrets = functions.config().doppler || {};

function redPacketMode(mode: string) : number {
  return mode == "random" ? 2 : 1;
}

const redPacketContract = (
    contract: string,
    signerOrProvider: Signer | ethers.providers.Provider
) => {
  return new ethers.Contract(
      contract,
      RED_PACKET_ABI,
      signerOrProvider
  );
};

async function validator() {
  if (env.FUNCTIONS_EMULATOR === "true") {
    return "0xEF2e3F91209F88A3143e36Be10D52502162426B3";
  }
  return await getEthAddressFromPublicKey(
      KMS_KEY_TYPE[KMS_KEY_TYPE.validator]
  );
}

async function signRaw(message: string) : Promise<Signature> {
  if (env.FUNCTIONS_EMULATOR === "true") {
    const validator = new ethers.Wallet(secrets.HARDHAT_VALIDATOR);
    return validator._signingKey().signDigest(message);
  } else {
    return await signWithKmsKey(
        KMS_KEY_TYPE[KMS_KEY_TYPE.validator],
        message,
        false
    ) as Signature;
  }
}

async function sign(message: string) : Promise<string> {
  if (env.FUNCTIONS_EMULATOR === "true") {
    const validator = new ethers.Wallet(secrets.HARDHAT_VALIDATOR);
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
    unsignedTx: PopulatedTransaction
) {
  const {chainId} = await provider.getNetwork();
  unsignedTx.chainId = chainId;
  unsignedTx.from = await validator();
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

export async function sendClaimTx(
    redPacket: {metadata: string},
    data: {chainId: string, claimer: string, creator?: string},
) {
  const parsed = JSON.parse(redPacket.metadata);
  const creator = parsed.creator || data.creator;
  const provider = getInfuraProvider(data.chainId);
  let unsignedTx = await redPacketContract(
      parsed.contract, provider
  ).populateTransaction.claim({
    creator,
    packet: {
      token: parsed.token,
      salt: parsed.salt,
      balance: EthBigNumber.from(parsed.tokenAmount),
      validator: parsed.validator,
      split: parsed.split,
      mode: redPacketMode(parsed.mode),
    },
    claimer: data.claimer,
    signature: [],
  });
  unsignedTx = await buildTx(provider, unsignedTx);
  const tx = await resolveProperties(unsignedTx);
  const signature = await signRaw(
      ethers.utils.keccak256(serialize(<UnsignedTransaction>tx))
  );
  const signedTx = serialize(<UnsignedTransaction>tx, signature);
  const sentTx = await provider.sendTransaction(signedTx);
  return sentTx.hash;
}

export const claimRedPacket = functions.https.onCall(
    async (data, context) => {
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized"};
      }
      const account = await accountAddress(data.chainId, uid);
      if (!account.address) {
        return account;
      }
      data.claimer = account.address;
      const redPacket = await getRedPacket(data.redPacketId);
      if (!redPacket) {
        return {code: 400, message: "Failed to load redpacket"};
      }
      if (data.signOnly) {
        const message = ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(
                ["bytes32", "address"],
                [redPacket.id, data.claimer]
            )
        );
        const signature = await sign(message);
        const [{id}] = await insertRedPacketClaim([{
          redPacketId: redPacket.id,
          creatorId: redPacket.user_id,
          claimerId: uid,
        }]);
        return {code: 200, id, signature};
      } else {
        const txHash = await sendClaimTx(redPacket, data);
        const [{id}] = await insertRedPacketClaim([{
          redPacketId: redPacket.id,
          creatorId: redPacket.user_id,
          claimerId: uid,
          tx: txHash,
        }]);
        return {code: 200, id, tx: txHash};
      }
    }
);
