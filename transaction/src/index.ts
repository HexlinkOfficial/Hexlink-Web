import express from "express";
import Queue from "bull";
import {ethers} from "ethers";
import {updateClaimTx, recordClaimTx} from "./operation";
import { RedPacketClaimInput, TxStatus } from "./types";

const app = express();
const port = 8080;

const operationQueue = new Queue("operationQueue");
const trackQueue = new Queue("trackQueue");

const getInfuraProvider = (
  chainId: string
) : ethers.providers.Provider => {
  return new ethers.providers.InfuraProvider(
      Number(chainId),
      process.env.VITE_INFURA_API_KEY,
  );
};

app.post('/submitClaimTx', async (req, res) => {
  const queuedStatus: TxStatus = "queued";
  const claimRequest: RedPacketClaimInput = {
    redPacketId: req.query.redPacketId as string,
    claimerId: req.query.claimerId as string,
    tx: req.query.tx as string,
    creatorId: req.query.creatorId as string,
    txStatus: queuedStatus
  };
  const id = await recordClaimTx(claimRequest);
  await operationQueue.add({
      id,
      chainId: req.query.chainId as string,
      signedTx: req.query.signedTx as string,
      from: req.query.from as string});
});

// start the Express server
app.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});

operationQueue.process(async (job) => {
  const provider: ethers.providers.Provider = getInfuraProvider(job.data.chainId);
  const txHash = await provider.sendTransaction(job.data.signedTx);

  const pendingStatus: TxStatus = "pending";
  updateClaimTx(job.data.id, pendingStatus);

  await trackQueue.add({id:job.data.id, tx: txHash, chainId: job.data.chainId, from: job.data.from});
});

trackQueue.process(async (job) => {
  const provider: ethers.providers.Provider = getInfuraProvider(job.data.chainId);
  const tx = await provider.getTransaction(job.data.tx)

  if (!tx || !tx.to || tx.from !== job.data.from) {
    const errorStatus: TxStatus = "error";
    updateClaimTx(job.data.id, errorStatus);
  }

  const successStatus: TxStatus = "success";
  updateClaimTx(job.data.id, successStatus);
  provider.removeAllListeners();
})
