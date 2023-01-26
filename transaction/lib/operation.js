"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClaimTx = exports.recordClaimTx = void 0;
const redpacket_1 = require("./graphql/redpacket");
const recordClaimTx = async (input) => {
    const ids = await (0, redpacket_1.insertRedPacketClaim)([input]);
    return ids[0].id;
};
exports.recordClaimTx = recordClaimTx;
const updateClaimTx = async (id, txStatus) => {
    await (0, redpacket_1.updateRedPacketTxStatus)(id, txStatus);
};
exports.updateClaimTx = updateClaimTx;
//# sourceMappingURL=operation.js.map