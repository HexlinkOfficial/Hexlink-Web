/* eslint-disable require-jsdoc */
import * as functions from "firebase-functions";
import {env} from "process";

import {insertRedPacketClaim, getRedPacket} from "./graphql/redpacket";
import {signWithKmsKey} from "./kms";
import {ethers, BigNumber as EthBigNumber, Signer, Signature} from "ethers";
import RED_PACKET_ABI from "./abi/HappyRedPacket.json";
import {getProvider, accountAddress, toEthSignedMessageHash} from "./account";
import {resolveProperties} from "@ethersproject/properties";
import {serialize, UnsignedTransaction} from "@ethersproject/transactions";
import {KMS_KEY_TYPE} from "./config";

const secrets = functions.config().doppler || {};

const RED_PACKET_CONTRACT : {[key: string]: string} = {
  "5": "0x36e21785316978491f6a0CF420af3d37848cE2dF",
  "137": "0xAAf0Bc5Ef7634b78F2d4f176a1f34493802e9d5C",
};

const redPacketContract = (
    chainId: string,
    signerOrProvider: Signer | ethers.providers.AlchemyProvider
) => {
  return new ethers.Contract(
      RED_PACKET_CONTRACT[chainId],
      RED_PACKET_ABI,
      signerOrProvider
  );
};

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
  const mHash = toEthSignedMessageHash(message);
  if (env.FUNCTIONS_EMULATOR === "true") {
    const validator = new ethers.Wallet(secrets.HARDHAT_VALIDATOR);
    return validator.signMessage(mHash);
  } else {
    return await signWithKmsKey(
        KMS_KEY_TYPE[KMS_KEY_TYPE.validator],
        mHash
    ) as string;
  }
}

export async function sendClaimTxWithoutSignature(
    redPacket: {metadata: string},
    data: {chainId: string, claimer: string, creator?: string},
) {
  const parsed = JSON.parse(redPacket.metadata);
  const creator = parsed.creator || data.creator;
  const provider = getProvider(data.chainId);
  const unsignedTx = await redPacketContract(
      data.chainId, provider
  ).populateTransaction.claimWithoutSignature(
      creator, {
        token: parsed.token,
        salt: parsed.salt,
        balance: EthBigNumber.from(parsed.balance),
        validator: parsed.validator,
        split: parsed.split,
        mode: parsed.mode,
      }, data.claimer
  );
  const tx = await resolveProperties(unsignedTx);
  const signature = await signRaw(
      ethers.utils.keccak256(serialize(<UnsignedTransaction>tx))
  );
  const signedTx = serialize(<UnsignedTransaction>tx, signature);
  const sentTx = await provider.sendTransaction(signedTx);
  return sentTx.hash;
}

export async function sendClaimTx(
    redPacket: {metadata: string},
    data: {chainId: string, claimer: string, creator?: string},
    signature: string,
) : Promise<string> {
  const parsed = JSON.parse(redPacket.metadata);
  const creator = parsed.creator || data.creator;

  const signer = new ethers.Wallet(
      secrets.HARDHAT_DEPLOYER,
      getProvider(data.chainId)
  );
  const tx = await redPacketContract(data.chainId, signer).claim(
      creator, {
        token: parsed.token,
        salt: parsed.salt,
        balance: EthBigNumber.from(parsed.balance),
        validator: parsed.validator,
        split: parsed.split,
        mode: parsed.mode,
      }, data.claimer, signature
  );
  return tx.hash;
}

export const claimRedPacket = functions.https.onCall(
    async (data, context) => {
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized"};
      }
      data.claimer = await accountAddress(data.chainId, uid);
      const redPacket = await getRedPacket(data.redPacketId);
      if (data.signOnly) {
        const message = ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(
                ["bytes32", "address"],
                [redPacket.id, data.claimer]
            )
        );
        const signature = await sign(message);
        const [{id}] = await insertRedPacketClaim(uid, [{
          redPacketId: redPacket.id,
          creatorId: redPacket.user_id,
        }]);
        return {code: 200, data: {id, signature}};
      } else {
        const txHash = await sendClaimTxWithoutSignature(redPacket, data);
        const [{id}] = await insertRedPacketClaim(uid, [{
          redPacketId: redPacket.id,
          creatorId: redPacket.user_id,
          tx: "",
        }]);
        return {code: 200, data: {id, tx: txHash}};
      }
    }
);
