import * as functions from "firebase-functions";

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

const IDENTITY_VERIFIER_OPERATOR_CONFIG: KMS_CONFIG_TYPE = {
  projectId: secrets.VITE_FIREBASE_PROJECT_ID,
  locationId: secrets.GCP_KEY_LOCATION_GLOBAL,
  keyRingId: secrets.IDENTITY_VERIFIER_OPERATOR_KEY_RING_ID,
  keyId: secrets.IDENTITY_VERIFIER_OPERATOR_KEY_ID,
  versionId: secrets.IDENTITY_VERIFIER_OPERATOR_VERSION_ID,
  publicAddress: secrets.IDENTITY_VERIFIER_OPERATOR_PUB_ADDR,
};

const IDENTITY_VERIFIER_VALIDATOR_CONFIG: KMS_CONFIG_TYPE = {
  projectId: secrets.VITE_FIREBASE_PROJECT_ID,
  locationId: secrets.GCP_KEY_LOCATION_GLOBAL,
  keyRingId: secrets.IDENTITY_VERIFIER_VALIDATOR_KEY_RING_ID,
  keyId: secrets.IDENTITY_VERIFIER_VALIDATOR_KEY_ID,
  versionId: secrets.IDENTITY_VERIFIER_VALIDATOR_VERSION_ID,
  publicAddress: secrets.IDENTITY_VERIFIER_VALIDATOR_PUB_ADDR,
};

export const KMS_CONFIG = new Map<string, KMS_CONFIG_TYPE>([
  [KMS_KEY_TYPE[KMS_KEY_TYPE.operator], IDENTITY_VERIFIER_OPERATOR_CONFIG],
  [KMS_KEY_TYPE[KMS_KEY_TYPE.validator], IDENTITY_VERIFIER_VALIDATOR_CONFIG],
]);
