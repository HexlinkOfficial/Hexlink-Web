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
  priceInfo,
  refunder,
} from "./config";

exports.priceInfo = priceInfo;
exports.refunder = refunder;

import {
  claimRedPacket,
} from "./redpacket";

exports.claimRedPacket = claimRedPacket;
