import * as functions from "firebase-functions";
import {getAuth} from "firebase-admin/auth";
import * as ethers from "ethers";
import {signWithKmsKey, getEthAddressFromPublicKey} from "./kms";
import {KMS_KEY_TYPE} from "./config";
import {toEthSignedMessageHash} from "./account";
import {Firebase} from "./firebase";

const EMAIL_SCHEMA = "mailto";

export const genEmailAuthProof = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized Call"};
      }
      const nameHashRes = await genNameHashFromEmail(uid);
      if (nameHashRes.code != 200) {
        return nameHashRes;
      }
      return genAuthProof(nameHashRes.nameHash!, data.requestId);
    }
);

const genAuthProof = async (nameHash: string, requestId: string) => {
  const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "bytes32"],
          [nameHash, requestId]
      )
  );
  const sig = await signWithKmsKey(
      KMS_KEY_TYPE[KMS_KEY_TYPE.operator],
      toEthSignedMessageHash(message)
  ) as string;
  return {code: 200, proof: sig};
};

const genNameHashFromEmail = async (uid: string) => {
  const user = await getAuth().getUser(uid);
  if (!user) {
    return {code: 400, message: "Invalid uid: failed to get the user."};
  }

  if (!user.email) {
    return {code: 400, message: "Invalid user: email is missing."};
  }

  const nameHash = calcNameHash(EMAIL_SCHEMA, user.email);
  return {code: 200, nameHash: nameHash};
};

const calcNameHash = function(schema: string, email: string) {
  return hash(`${schema}:${email}`);
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
