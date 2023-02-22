import * as functions from "firebase-functions";
import * as ethers from "ethers";
import {signWithKmsKey, getEthAddressFromPublicKey} from "./kms";
import {kmsConfig, KMS_KEY_TYPE} from "./config";
import {
  GenNameHashSuccess,
  genNameHash,
  toEthSignedMessageHash,
} from "./account";
import {Firebase} from "./firebase";

const TWITTER_PROVIDER_ID = "twitter.com";
const EMAIL_PROVIDER_ID = "mailto";
const OAUTH_AUTH_TYPE = "oauth";
const OTP_AUTH_TYPE = "otp";

const secrets = functions.config().doppler || {};

export interface AuthProof {
  name: string,
  requestId: string,
  authType: string,
  identityType: string,
  issuedAt: number,
  signature: string
}

export const genTwitterOAuthProof = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized Call"};
      }

      return genAuthProof(uid, TWITTER_PROVIDER_ID, OAUTH_AUTH_TYPE,
          data.requestId, data.version);
    });

export const genEmailOTPProof = functions.https.onCall(
    async (data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized Call"};
      }

      return genAuthProof(uid, EMAIL_PROVIDER_ID, OTP_AUTH_TYPE,
          data.requestId, data.version);
    });

const genAuthProof = async (uid: string, identity: string,
    auth: string, requestId: string, version?: number) => {
  const result = await genNameHash(uid, version);
  if (result.code !== 200) {
    return result;
  }
  const {nameHash} = result as GenNameHashSuccess;

  const identityType = hash(identity);
  const authType = hash(auth);

  // reserve some time for current block
  const issuedAt = Math.round(Date.now() / 1000) - 30;
  const message = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
          ["bytes32", "bytes32", "uint256", "bytes32", "bytes32"],
          [
            nameHash,
            requestId,
            issuedAt,
            identityType,
            authType,
          ]
      )
  );

  let encodedSig;
  if (process.env.FUNCTIONS_EMULATOR) {
    // note
    const validator = new ethers.Wallet(secrets.HARDHAT_VALIDATOR);
    const signature = await validator.signMessage(
        ethers.utils.arrayify(message)
    );
    encodedSig = ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes"], [await validator.getAddress(), signature]
    );
  } else {
    const sig = await signWithKmsKey(
        KMS_KEY_TYPE[KMS_KEY_TYPE.operator],
        toEthSignedMessageHash(message)
    ) as string;
    const validatorAddr = kmsConfig().get(
        KMS_KEY_TYPE[KMS_KEY_TYPE.operator]
    )?.publicAddress;
    encodedSig = ethers.utils.defaultAbiCoder.encode(
        ["address", "bytes"], [validatorAddr, sig]
    );
  }

  const AuthProof: AuthProof = {
    name: nameHash,
    requestId: requestId,
    issuedAt: issuedAt,
    identityType: identity,
    authType: auth,
    signature: encodedSig,
  };
  return {code: 200, authProof: AuthProof};
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
