import * as functions from "firebase-functions";
import {getAuth} from "firebase-admin/auth";
import * as ethers from "ethers";
import {signWithKmsKey, getEthAddressFromPublicKey} from "./kms";
import {kmsConfig, KMS_KEY_TYPE} from "./config";
import {
  toEthSignedMessageHash,
} from "./account";
import {Firebase} from "./firebase";

const EMAIL_SCHEMA = "mailto";

export const genEmailAuthProof = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized Call"};
      }

      const nameHashRes = await genNameHashFromEmail(EMAIL_SCHEMA, uid);
      if (nameHashRes.code != 200) {
        return nameHashRes;
      }

      return genAuthProof(nameHashRes.nameHash!, data.requestId);
    }
);

const genAuthProof = async (nameHash: string, requestId: string) => {
  const expiredAt = Math.round(Date.now() / 1000) + 3600;
  const validator = kmsConfig().get(
      KMS_KEY_TYPE[KMS_KEY_TYPE.operator]
  )!.publicAddress!;
  const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "bytes32", "uint256", "address"],
          [
            nameHash,
            requestId,
            expiredAt,
            validator,
          ]
      )
  );

  const sig = await signWithKmsKey(
      KMS_KEY_TYPE[KMS_KEY_TYPE.operator],
      toEthSignedMessageHash(message)
  ) as string;
  const encodedSig = ethers.utils.defaultAbiCoder.encode(
      ["uint256", "address", "bytes"],
      [expiredAt, validator, sig]
  );

  return {code: 200, proof: encodedSig};
};

const genNameHashFromEmail = async (schema: string, uid: string) => {
  const user = await getAuth().getUser(uid);

  if (!user) {
    return {code: 400, message: "Invalid uid: failed to get the user."};
  }

  if (!user.email) {
    return {code: 400, message: "Invalid user: email is missing."};
  }

  const emailArr = user.email?.split("@");
  if (!emailArr || emailArr.length != 2) {
    return {code: 400, message: "Invalid user: email is invalid."};
  }

  const nameHash = calcNameHash(schema, emailArr[1], emailArr[0]);
  return {code: 200, nameHash: nameHash};
};

const calcNameHash = function(schema: string, domain: string, handler: string) {
  const encodedName = ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "bytes32", "bytes32"],
      [hash(schema), hash(domain), hash(handler)]
  );
  return ethers.utils.keccak256(encodedName);
};

const hash = function(value: string) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(value));
};

export const calcEthAddress = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      return getEthAddressFromPublicKey(data.keyId, data.keyType);
    }
);
