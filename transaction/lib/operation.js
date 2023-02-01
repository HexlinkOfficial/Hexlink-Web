"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processActions = exports.buildTxFromOps = void 0;
const ethers_1 = require("ethers");
const properties_1 = require("@ethersproject/properties");
const transactions_1 = require("@ethersproject/transactions");
const redpacket_1 = require("./graphql/redpacket");
const common_1 = require("../../functions/common");
const redpacket_2 = require("../../functions/redpacket");
async function buildTx(provider, unsignedTx, from) {
    const { chainId } = await provider.getNetwork();
    unsignedTx.chainId = chainId;
    unsignedTx.from = from;
    unsignedTx.type = 2;
    unsignedTx.nonce = await provider.getTransactionCount(unsignedTx.from);
    unsignedTx.gasLimit = ethers_1.BigNumber.from(500000);
    const feeData = await provider.getFeeData();
    unsignedTx.maxPriorityFeePerGas =
        feeData.maxPriorityFeePerGas || ethers_1.BigNumber.from(0);
    unsignedTx.maxFeePerGas = feeData.maxFeePerGas ||
        ethers_1.BigNumber.from(common_1.PriceConfigs[chainId.toString()].gasPrice);
    return unsignedTx;
}
async function buildTxFromOps(provider, ops, signer) {
    const contract = await (0, common_1.hexlContract)(provider);
    let unsignedTx = await contract.populateTransaction.process(ops);
    unsignedTx = await buildTx(provider, unsignedTx, signer.address);
    const tx = await (0, properties_1.resolveProperties)(unsignedTx);
    const signature = signer._signingKey().signDigest(ethers_1.ethers.utils.keccak256((0, transactions_1.serialize)(tx)));
    return (0, transactions_1.serialize)(tx, signature);
}
exports.buildTxFromOps = buildTxFromOps;
async function processAction(op, chain, action, receipt) {
    const params = action.params;
    if (action.type === "insert_redpacket_claim") {
        const claimed = (0, redpacket_2.parseClaimed)(chain, receipt, params.redPacketId, op.account);
        if (claimed !== undefined) {
            await (0, redpacket_1.insertRedPacketClaim)({
                ...params,
                claimed,
                opId: op.id,
            });
        }
    }
    if (action.type == "insert_redpacket") {
        const deposit = (0, common_1.parseDeposit)(receipt, params.redPacketId, op.account, params.refunder);
        const created = (0, redpacket_2.parseCreated)(chain, receipt, params.redPacketId);
        if (created !== undefined) {
            console.log(created.packet);
            await (0, redpacket_1.insertRedPacket)(params.userId, [{
                    id: params.redPacketId,
                    creator: params.creator,
                    userId: op.userId,
                    metadata: created.packet,
                    opId: op.id,
                    deposit: {
                        receipt: deposit === null || deposit === void 0 ? void 0 : deposit.receipt,
                        token: deposit === null || deposit === void 0 ? void 0 : deposit.token,
                        amount: deposit === null || deposit === void 0 ? void 0 : deposit.amount.toString(),
                    }
                }]);
        }
    }
}
async function processActions(chain, op, receipt) {
    await Promise.all(op.actions.map(action => processAction(op, chain, action, receipt)));
}
exports.processActions = processActions;
//# sourceMappingURL=operation.js.map