import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const secrets = functions.config().doppler || {};

const credential = secrets.GOOGLE_CREDENTIAL_JSON;
let params;
if (credential) {
  const serviceAccount = JSON.parse(credential);
  params = {
    credential: admin.credential.cert(serviceAccount),
  };
} else {
  params = functions.config().firebase;
}

admin.initializeApp(params);
admin.firestore().settings({ignoreUndefinedProperties: true});

import {
  processSignUp,
  refreshToken,
} from "./hasura";

exports.processSignUp = processSignUp;
exports.refreshToken = refreshToken;

import {
  metadata,
  deployWallet,
  executeTx,
  sendERC20,
  sendETH,
  estimateERC20Transfer,
  estimateETHTransfer,
} from "./wallet";

exports.metadata = metadata;
exports.deployWallet = deployWallet;
exports.sendERC20 = sendERC20;
exports.sendETH = sendETH;
exports.executeTx = executeTx;
exports.estimateERC20Transfer = estimateERC20Transfer;
exports.estimateETHTransfer = estimateETHTransfer;
