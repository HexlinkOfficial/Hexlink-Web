import {
  processSignUp,
  refreshToken,
} from "./hasura";

exports.processSignUp = processSignUp;
exports.refreshToken = refreshToken;

import {
  isFollowing,
  hasRetweeted} from "./twitter/twitter";

exports.isFollowing = isFollowing;
exports.hasRetweeted = hasRetweeted;

import {
  genTwitterOAuthProof,
  calcEthAddress,
} from "./verifier";

exports.genTwitterOAuthProof = genTwitterOAuthProof;
exports.calcEthAddress = calcEthAddress;

import {
  priceConfig,
} from "./config";

exports.priceConfig = priceConfig;
// exports.refunder = refunder;

import {
  claimRedPacket,
  createRedPacket,
  createRedPacketErc721,
} from "./redpacket";

exports.claimRedPacket = claimRedPacket;
exports.createRedPacket = createRedPacket;
exports.createRedPacketErc721 = createRedPacketErc721;

import {
  sendToken,
} from "./operation";

exports.sendToken = sendToken;

import {
  genOTP,
  validateOTP,
  refreshCustomToken,
} from "./signin";

exports.genOTP = genOTP;
exports.validateOTP = validateOTP;
exports.refreshCustomToken = refreshCustomToken;
