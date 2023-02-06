"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processActions = exports.buildTx = void 0;
const ethers_1 = require("ethers");
const redpacket_1 = require("./graphql/redpacket");
const common_1 = require("../../functions/common");
const redpacket_2 = require("../../functions/redpacket");
const operation_1 = require("./graphql/operation");
async function buildTx(provider, chain, unsignedTx, from) {
    const { chainId } = await provider.getNetwork();
    unsignedTx.chainId = chainId;
    unsignedTx.from = from;
    unsignedTx.type = 2;
    unsignedTx.nonce = await provider.getTransactionCount(unsignedTx.from);
    const feeData = await provider.getFeeData();
    unsignedTx.maxPriorityFeePerGas =
        feeData.maxPriorityFeePerGas || ethers_1.BigNumber.from(0);
    unsignedTx.maxFeePerGas = feeData.maxFeePerGas ||
        ethers_1.BigNumber.from(common_1.PriceConfigs[chain.name]);
    return unsignedTx;
}
exports.buildTx = buildTx;
async function processAction(op, chain, action, receipt) {
    const params = action.params;
    if (action.type === "insert_redpacket_claim") {
        const claimed = (0, redpacket_2.parseClaimed)(chain, receipt, params.redPacketId, op.account);
        if (claimed !== undefined) {
            await (0, redpacket_1.insertRedPacketClaim)([{
                    ...params,
                    claimed,
                    opId: op.id,
                }]);
        }
        else {
            console.log("redpacket claim not found: " + params.redPacketId);
            await (0, operation_1.updateOp)(op.id, undefined, "claim event not found");
        }
    }
    if (action.type === "insert_redpacket") {
        const created = (0, redpacket_2.parseCreated)(chain, receipt, params.redPacketId);
        if (created !== undefined) {
            const deposit = (0, common_1.parseDeposit)(receipt, params.redPacketId, op.account, params.refunder);
            await (0, redpacket_1.insertRedPacket)(params.userId, [{
                    id: params.redPacketId,
                    creator: params.creator,
                    userId: op.userId,
                    metadata: {
                        token: created.packet.token,
                        balance: created.packet.balance.toString(),
                        split: created.packet.split,
                        salt: created.packet.salt,
                        validator: created.packet.validator,
                        mode: created.packet.mode,
                        creator: created.creator,
                        contract: (0, redpacket_2.redPacketAddress)(chain),
                    },
                    opId: op.id,
                    deposit: {
                        receipt: deposit === null || deposit === void 0 ? void 0 : deposit.receipt,
                        token: deposit === null || deposit === void 0 ? void 0 : deposit.token,
                        amount: deposit === null || deposit === void 0 ? void 0 : deposit.amount.toString(),
                        priceInfo: params.priceInfo,
                    }
                }]);
        }
        else {
            console.log("redpacket not found: " + params.redPacketId);
            await (0, operation_1.updateOp)(op.id, undefined, "redpacket event not found");
        }
    }
}
async function processActions(chain, op, receipt) {
    await Promise.all(op.actions.map(action => processAction(op, chain, action, receipt)));
}
exports.processActions = processActions;
//# sourceMappingURL=operation.js.map