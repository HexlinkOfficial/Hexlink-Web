import {
  processSignUp,
  refreshToken,
} from "./hasura";

exports.processSignUp = processSignUp;
exports.refreshToken = refreshToken;

import {
  isFollowing,
  hasRetweeted,
} from "./twitter/twitter";

exports.isFollowing = isFollowing;
exports.hasRetweeted = hasRetweeted;

import {
  claimRedPacket,
  createRedPacket,
  createRedPacketErc721,
  claimCountdown,
  refundRedPacket,
} from "./redpacket";

exports.claimRedPacket = claimRedPacket;
exports.createRedPacket = createRedPacket;
exports.createRedPacketErc721 = createRedPacketErc721;
exports.claimCountdown = claimCountdown;
exports.refundRedPacket = refundRedPacket;

import {
  genAndSendOTP,
  validateOTP,
  notifyTransfer,
} from "./signin";

exports.genAndSendOTP = genAndSendOTP;
exports.validateOTP = validateOTP;
exports.notifyTransfer = notifyTransfer;
