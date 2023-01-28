// validator key id is the key id of the kms key stored in GCP
// validator addr is the key of the eth address of the kms key stored in doppler
const validatorKeyIdBase = "validatorKey";
const validatorAddrBase = "IDENTITY_VERIFIER_VALIDATOR_PUB_ADDR";

export let validatorMap = new Map<string, string>();
validatorMap.set(validatorKeyIdBase, process.env[validatorAddrBase]!);
for (let i = 1; i < 9; i ++) {
  validatorMap.set(validatorKeyIdBase + i,
      process.env[validatorAddrBase + "_" + i]!);
}

export const validatorKeyIds =[ ...validatorMap.keys() ];
