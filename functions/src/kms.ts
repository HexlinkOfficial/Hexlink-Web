/* eslint-disable require-jsdoc */
import * as kms from "@google-cloud/kms";
import * as asn1 from "asn1.js";
import * as crypto from "crypto";
import * as ethers from "ethers";
import * as crc32c from "fast-crc32c";
import * as BN from "bn.js";
import {Signature} from "ethers";
import {KMS_KEY_TYPE, kmsConfig, KMS_CONFIG_TYPE} from "./config";

const MAX_RETRY = 3;

const client = new kms.KeyManagementServiceClient();

const getPublicKey = async function(versionName: string) {
  const [publicKey] = await client.getPublicKey({
    name: versionName,
  });

  if (publicKey.name !== versionName) {
    throw new Error("GetPublicKey: request corrupted in-transit");
  }
  if (publicKey.pemCrc32c &&
    crc32c.calculate(publicKey.pem || "") !== Number(publicKey.pemCrc32c.value)
  ) {
    throw new Error("GetPublicKey: response corrupted in-transit");
  }

  return publicKey;
};

const getVersionName = async function(keyType: string) {
  if (!Object.values(KMS_KEY_TYPE).includes(keyType)) {
    throw new Error("Invalid key type: " + keyType +
        ", while getting version name.");
  }

  const config: KMS_CONFIG_TYPE = kmsConfig().get(keyType)!;
  return client.cryptoKeyVersionPath(
      config.projectId,
      config.locationId,
      config.keyRingId,
      config.keyId,
      config.versionId!
  );
};

export const getEthAddressFromPublicKey = async function(
    keyId: string,
    keyType: string
) {
  const config: KMS_CONFIG_TYPE = kmsConfig().get(keyType)!;
  const versionName = client.cryptoKeyVersionPath(
      config.projectId,
      config.locationId,
      config.keyRingId,
      keyId,
      config.versionId!
  );
  const publicKey = await getPublicKey(versionName);
  const publicKeyPem = publicKey.pem || "";
  const publicKeyDer = crypto.createPublicKey(publicKeyPem)
      .export({format: "der", type: "spki"});
  const rawXY = publicKeyDer.subarray(-64);
  const hashXY = ethers.utils.keccak256(rawXY);
  const address = "0x" + hashXY.slice(-40);

  return address;
};

function hex(sig: Signature) : string {
  return "0x" + sig.r + sig.s + sig.recoveryParam.toString(16);
}

/* eslint-disable */
const EcdsaSigAsnParse: {
  decode: (asnStringBuffer: Buffer, format: "der") => { r: BN; s: BN };
} = asn1.define("EcdsaSig", function (this: any) {
  this.seq().obj(this.key("r").int(), this.key("s").int());
});

export const signWithKmsKey = async function(
    keyType: string,
    message: string,
    returnHex = true
) : Promise<Signature | string> {
  const digestBuffer = Buffer.from(ethers.utils.arrayify(message));
  const address = kmsConfig().get(keyType)!.publicAddress!;

  let signature = await getKmsSignature(digestBuffer, keyType);
  let [r, s] = await calculateRS(signature as Buffer);
  
  let retry = 0;
  while (shouldRetrySigning(r, s, retry)) {
    signature = await getKmsSignature(digestBuffer, keyType);
    [r, s] = await calculateRS(signature as Buffer);
    retry += 1;
  }

  const v = calculateRecoveryParam(
      digestBuffer,
      r,
      s,
      address);

  const sig = {r: r.toString("hex"), s: s.toString("hex"), recoveryParam: v} as Signature;
  return returnHex ? hex(sig) : sig;
};

const shouldRetrySigning = function(r: BN, s: BN, retry: number) {
  return (r.toString("hex").length % 2 == 1 || s.toString("hex").length % 2 == 1) && (retry < MAX_RETRY); 
}

const getKmsSignature = async function(digestBuffer: Buffer, keyType: string) {
  const digestCrc32c = crc32c.calculate(digestBuffer);
  const versionName = await getVersionName(keyType);

  const [signResponse] = await client.asymmetricSign({
    name: versionName,
    digest: {
      sha256: digestBuffer,
    },
    digestCrc32c: {
      value: digestCrc32c,
    },
  });

  if (signResponse.name !== versionName) {
    throw new Error("AsymmetricSign: request corrupted in-transit");
  }
  if (!signResponse.verifiedDigestCrc32c) {
    throw new Error("AsymmetricSign: request corrupted in-transit");
  }
  if (!signResponse.signature || !signResponse.signatureCrc32c ||
    crc32c.calculate(<string>signResponse.signature) !==
    Number(signResponse.signatureCrc32c.value)
  ) {
    throw new Error("AsymmetricSign: response corrupted in-transit");
  }

  return Buffer.from(signResponse.signature);
};

const calculateRS = async function(signature: Buffer) {
  const decoded = EcdsaSigAsnParse.decode(signature, "der");
  const { r, s } = decoded;

  const secp256k1N = new BN.BN(
      "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
      16
  );
  const secp256k1halfN = secp256k1N.div(new BN.BN(2));
  
  return [r, s.gt(secp256k1halfN) ? secp256k1N.sub(s) : s];
};

const calculateRecoveryParam = (
    msg: Buffer,
    r: BN,
    s: BN,
    address: string
) => {
  let v: number;
  for (v = 0; v <= 1; v++) {
    const recoveredEthAddr = ethers.utils.recoverAddress(
        `0x${msg.toString("hex")}`,
        {
          r: `0x${r.toString("hex")}`,
          s: `0x${s.toString("hex")}`,
          v,
        }
    ).toLowerCase();

    if (recoveredEthAddr != address.toLowerCase()) {
      continue;
    }

    return v + 27;
  }

  throw new Error("Failed to calculate recovery param");
};


const getSymmKeyName = async function() {
  let config: KMS_CONFIG_TYPE = kmsConfig().get("encryptor")!;
  if (process.env.FUNCTIONS_EMULATOR) {
    config = kmsConfig().get("encryptorTest")!;
  }

  return client.cryptoKeyPath(
      config.projectId,
      config.locationId,
      config.keyRingId,
      config.keyId);
};

export const encryptWithSymmKey = async function(plaintext: string) {
  const plaintextBuffer = Buffer.from(plaintext);
  const keyName = await getSymmKeyName();
  const plaintextCrc32c = crc32c.calculate(plaintextBuffer);

  const [encryptResponse] = await client.encrypt({
    name: keyName,
    plaintext: plaintextBuffer,
    plaintextCrc32c: {
      value: plaintextCrc32c,
    },
  });

  const ciphertext = encryptResponse.ciphertext;

  if (!ciphertext || !encryptResponse.verifiedPlaintextCrc32c ||
    !encryptResponse.ciphertextCrc32c ||
    crc32c.calculate(ciphertext) !==
    Number(encryptResponse.ciphertextCrc32c!.value)) {
    throw new Error("Encrypt: request corrupted in-transit");
  }

  const encode = Buffer.from(ciphertext).toString("base64");

  return encode;
};

export const decryptWithSymmKey = async function(text: string) {
  const ciphertext = Buffer.from(text, "base64");
  const keyName = await getSymmKeyName();
  const ciphertextCrc32c = crc32c.calculate(ciphertext);

  const [decryptResponse] = await client.decrypt({
    name: keyName,
    ciphertext: ciphertext,
    ciphertextCrc32c: {
      value: ciphertextCrc32c,
    },
  });
  const plaintextBuffer = Buffer.from(decryptResponse.plaintext!);

  if (crc32c.calculate(plaintextBuffer) !==
      Number(decryptResponse.plaintextCrc32c!.value)) {
    throw new Error("Decrypt: response corrupted in-transit");
  }

  return plaintextBuffer.toString("utf8");
};
