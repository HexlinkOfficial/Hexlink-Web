import * as functions from "firebase-functions";

const secrets = functions.config().doppler;

export enum KMS_KEY_TYPE {
  operator,
  validator,
  encryptor
}

export interface KMS_CONFIG_TYPE {
  projectId: string,
  locationId: string,
  keyRingId: string,
  keyId: string,
  versionId?: string,
  publicAddress?: string
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

const encryptorConfig = () : KMS_CONFIG_TYPE => ({
  projectId: secrets.VITE_FIREBASE_PROJECT_ID,
  locationId: secrets.GCP_KEY_LOCATION_GLOBAL,
  keyRingId: secrets.ENCRYPTOR_VALIDATOR_KEY_RING_ID,
  keyId: secrets.ENCRYPTOR_VALIDATOR_KEY_ID,
});

export const kmsConfig = () => new Map<string, KMS_CONFIG_TYPE>([
  [KMS_KEY_TYPE[KMS_KEY_TYPE.operator], identityVerifierOperatorConfig()],
  [KMS_KEY_TYPE[KMS_KEY_TYPE.validator], identityVerifierValidatorConfig()],
  [KMS_KEY_TYPE[KMS_KEY_TYPE.encryptor], encryptorConfig()],
]);
