"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bull_1 = __importDefault(require("bull"));
const ethers_1 = require("ethers");
const operation_1 = require("./operation");
const app = (0, express_1.default)();
const port = 8080;
const operationQueue = new bull_1.default("operationQueue");
const trackQueue = new bull_1.default("trackQueue");
const getInfuraProvider = (chainId) => {
    return new ethers_1.ethers.providers.InfuraProvider(Number(chainId), process.env.VITE_INFURA_API_KEY);
};
app.post('/submitClaimTx', async (req, res) => {
    const queuedStatus = "queued";
    const claimRequest = {
        redPacketId: req.query.redPacketId,
        claimerId: req.query.claimerId,
        tx: req.query.tx,
        creatorId: req.query.creatorId,
        txStatus: queuedStatus
    };
    const id = await (0, operation_1.recordClaimTx)(claimRequest);
    await operationQueue.add({
        id,
        chainId: req.query.chainId,
        signedTx: req.query.signedTx,
        from: req.query.from
    });
});
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
operationQueue.process(async (job) => {
    const provider = getInfuraProvider(job.data.chainId);
    const txHash = await provider.sendTransaction(job.data.signedTx);
    const pendingStatus = "pending";
    (0, operation_1.updateClaimTx)(job.data.id, pendingStatus);
    await trackQueue.add({ id: job.data.id, tx: txHash, chainId: job.data.chainId, from: job.data.from });
});
trackQueue.process(async (job) => {
    const provider = getInfuraProvider(job.data.chainId);
    const tx = await provider.getTransaction(job.data.tx);
    if (!tx || !tx.to || tx.from !== job.data.from) {
        const errorStatus = "error";
        (0, operation_1.updateClaimTx)(job.data.id, errorStatus);
    }
    const successStatus = "success";
    (0, operation_1.updateClaimTx)(job.data.id, successStatus);
    provider.removeAllListeners();
});
//# sourceMappingURL=index.js.map