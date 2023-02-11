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
} from "./redpacket";

exports.claimRedPacket = claimRedPacket;
exports.createRedPacket = createRedPacket;

import {
  sendErc20Token,
} from "./operation";

exports.sendErc20Token = sendErc20Token;
