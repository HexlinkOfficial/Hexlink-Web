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
  getBalance,
  deployAccount,
  executeTx,
  sendERC20,
  sendERC721,
  sendETH,
  estimateERC20Transfer,
  estimateETHTransfer,
} from "./account";

exports.getBalance = getBalance;
exports.deployAccount = deployAccount;
exports.sendERC20 = sendERC20;
exports.sendERC721 = sendERC721;
exports.sendETH = sendETH;
exports.executeTx = executeTx;
exports.estimateERC20Transfer = estimateERC20Transfer;
exports.estimateETHTransfer = estimateETHTransfer;

import {
  isFollowing,
  hasRetweeted} from "./twitter/twitter";

exports.isFollowing = isFollowing;
exports.hasRetweeted = hasRetweeted;
