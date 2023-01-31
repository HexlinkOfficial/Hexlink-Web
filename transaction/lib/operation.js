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
        ethers_1.BigNumber.from(common_1.PriceConfig[chainId.toString()].gasPrice);
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
async function processAction(chain, action, receipt) {
    if (action.type === "claim_redpacket") {
        const params = action.params;
        const claimed = (0, redpacket_2.parseClaimed)(chain, receipt, params.redPacketId, params.claimer);
        await (0, redpacket_1.updateRedPacketClaim)(params.claimId, (claimed === null || claimed === void 0 ? void 0 : claimed.toString()) || "0");
    }
}
async function processActions(chain, actions, receipt) {
    await Promise.all(actions.map(action => processAction(chain, action, receipt)));
}
exports.processActions = processActions;
//# sourceMappingURL=operation.js.map