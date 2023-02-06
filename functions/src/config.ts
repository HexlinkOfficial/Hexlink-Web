import * as functions from "firebase-functions";
import {PriceConfigs} from "../common";

const secrets = functions.config().doppler;

export enum KMS_KEY_TYPE {
  operator,
  validator
}

export interface KMS_CONFIG_TYPE {
  projectId: string,
  locationId: string,
  keyRingId: string,
  keyId: string,
  versionId: string,
  publicAddress: string
}

const identityVerifierOperatorConfig = () : KMS_CONFIG_TYPE => ({
  projectId: secrets.VITE_FIREBASE_PROJECT_ID,
  locationId: secrets.GCP_KEY_LOCATION_GLOBAL,
  keyRingId: secrets.IDENTITY_VERIFIER_OPERATOR_KEY_RING_ID,
  keyId: secrets.IDENTITY_VERIFIER_OPERATOR_KEY_ID,
  versionId: secrets.IDENTITY_VERIFIER_OPERATOR_VERSION_ID,
  publicAddress: secrets.IDENTITY_VERIFIER_OPERATOR_PUB_ADDR,
});

const identityVerifierValidatorConfig = () : KMS_CONFIG_TYPE => ({
  projectId: secrets.VITE_FIREBASE_PROJECT_ID,
  locationId: secrets.GCP_KEY_LOCATION_GLOBAL,
  keyRingId: secrets.IDENTITY_VERIFIER_VALIDATOR_KEY_RING_ID,
  keyId: secrets.IDENTITY_VERIFIER_VALIDATOR_KEY_ID,
  versionId: secrets.IDENTITY_VERIFIER_VALIDATOR_VERSION_ID,
  publicAddress: secrets.IDENTITY_VERIFIER_VALIDATOR_PUB_ADDR,
});

export const kmsConfig = () => new Map<string, KMS_CONFIG_TYPE>([
  [KMS_KEY_TYPE[KMS_KEY_TYPE.operator], identityVerifierOperatorConfig()],
  [KMS_KEY_TYPE[KMS_KEY_TYPE.validator], identityVerifierValidatorConfig()],
]);

export const priceConfig = functions.https.onCall(
    (data, context) => {
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized Call"};
      }
      return {priceConfig: PriceConfigs[data.chain]};
    }
);

export const Refunders : {[key: string]: string} = {
  "goerli": "0x1A811678eEEDF16a1D0dF4b12e290F78a61A28F9",
  "polygon": "0x1A811678eEEDF16a1D0dF4b12e290F78a61A28F9",
  "mumbai": "0x1A811678eEEDF16a1D0dF4b12e290F78a61A28F9",
};

export const refunder = functions.https.onCall(
    (data, context) => {
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized Call"};
      }
      return {refunder: Refunders[data.chain]};
    }
);
