import * as functions from "firebase-functions";
import {BigNumber} from "ethers";

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

interface NetworkConfig {
  alchemy: {
    rpcUrl: string,
    key: string,
  },
  nativeCurrency: {
    priceInUsd: string,
  },
  defaultGasPrice: BigNumber,
  addresses: {[key: string]: string | string[]}
}

const GOERLI : NetworkConfig = {
  alchemy: {
    rpcUrl: "https://eth-goerli.g.alchemy.com/v2/U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
    key: "U4LBbkMIAKCf4GpjXn7nB7H1_P9GiU4b",
  },
  nativeCurrency: {
    priceInUsd: "1500.0",
  },
  defaultGasPrice: BigNumber.from("10000000000"),
  addresses: {
    "hexlink": "0xbad6a7948a1d3031ee7236d0180b6271fa569148",
    "refund": "0x1A811678eEEDF16a1D0dF4b12e290F78a61A28F9",
    "nativeCoin": "0x0000000000000000000000000000000000000000",
    "redPacket": "0x36e21785316978491f6a0CF420af3d37848cE2dF",
    "wrappedCoin": "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
    "stableCoins": [
      "0x2f3a40a3db8a7e3d09b0adfefbce4f6f81927557", // usdc
      "0x07865c6E87B9F70255377e024ace6630C1Eaa37F", // usdc2
      "0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844", // dai
    ],
    "validator": "0xEF2e3F91209F88A3143e36Be10D52502162426B3",
  },
};

const POLYGON : NetworkConfig = {
  alchemy: {
    rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/1GmfWOSlYIlUI0UcCu4Y2O-8DmFJrlqA",
    key: "1GmfWOSlYIlUI0UcCu4Y2O-8DmFJrlqA",
  },
  nativeCurrency: {
    priceInUsd: "1.0",
  },
  defaultGasPrice: BigNumber.from("100000000000"),
  addresses: {
    "nativeCoin": "0x0000000000000000000000000000000000001010",
    "wrappedCoin": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    "stableCoins": [
      "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // usdt
      "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // usdc
      "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // dai
    ],
    "validator": "0x030ffbc193c3f9f4c6378beb506eecb0933fd457",
  },
};

const MUMBAI : NetworkConfig= {
  alchemy: {
    rpcUrl: "https://polygon-mumbai.g.alchemy.com/v2/Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
    key: "Fj__UEjuIj0Xym6ofwZfJbehuuXGpDxe",
  },
  nativeCurrency: {
    priceInUsd: "1.0",
  },
  defaultGasPrice: BigNumber.from("2000000000"),
  addresses: {
    "hexlink": "0x78317ef8b020Fe10e845ab8723403cF1e58Ef1Cc",
    "refund": "0x1A811678eEEDF16a1D0dF4b12e290F78a61A28F9",
    "redPacket": "0xAAf0Bc5Ef7634b78F2d4f176a1f34493802e9d5C",
    "nativeCoin": "0x0000000000000000000000000000000000000000",
    "wrappedCoin": "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    "stableCoins": [
      "0xE097d6B3100777DC31B34dC2c58fB524C2e76921", // usdc
    ],
    "validator": "0xEF2e3F91209F88A3143e36Be10D52502162426B3",
  },
};

const NetworkConfig : {[key: number]: NetworkConfig} = {
  5: GOERLI,
  137: POLYGON,
  80001: MUMBAI,
};

export const networkConfig = functions.https.onCall(
    (data, context) => {
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized Call"};
      }
      return NetworkConfig[data.chainId];
    }
);
