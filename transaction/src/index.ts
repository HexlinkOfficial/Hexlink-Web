import express from "express";
import Queue from "bull";
import cache from "node-cache";
import {ethers} from "ethers";
import {recordClaimTx, recordTx, updateTx} from "./operation";
import {RedPacketClaimInput, TxStatus, Operation} from "./types";
import {validatorKeyIds, validatorMap} from "./sender";
import {getChain} from "../../functions/common";
import type {Chain} from "../../functions/common";

const app = express();
const port = 8080;

const operationQueue = new Queue("operationQueue");
const transactionQueue = new Queue("transactionQueue");
const sendersInProcessCache = "senders_in_process";
const senderCache = new cache();
senderCache.set(sendersInProcessCache, []);

const getInfuraProvider = (
  chain: Chain
) : ethers.providers.Provider => {
  return new ethers.providers.InfuraProvider(
      Number(chain.chainId),
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
      signedTx: req.query.signedTx as string
  });
});

app.post('/submitTx', async (req: {
  query: {chain: string, op: Operation}
}, _res) => {
  await operationQueue.add({
    chain: req.query.chain,
    op: req.query.op,
  });
});

// start the Express server
app.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});

operationQueue.process(async (job: any) => {
  // get the list of senders in process
  const sendersInProcess: string[] = senderCache.get(sendersInProcessCache)!;
  const sendersInIdle = validatorKeyIds.filter(k => !sendersInProcess.includes(k));
  // use the first sender in idle;
  // if there is no available one, select a sender randomly from the senders pool
  const sender = sendersInIdle.length > 0 ? sendersInIdle[0]
      : validatorKeyIds[Math.floor(Math.random() * validatorKeyIds.length)];

  const chain: Chain = getChain(job.data.chain);
  const provider: ethers.providers.Provider = getInfuraProvider(chain);

  const tx = buildTxFromOp(job.data.op);
  const txHash = await provider.sendTransaction(tx);

  const id = await recordTx(chain.name, job.data.tx);
  await transactionQueue.add({id, chain, txHash, sender});

  // cache the new occupied sender to the senders in process list
  senderCache.set(sendersInProcessCache, sendersInProcess.push(sender));
});

transactionQueue.process(async (job: any) => {
  const provider: ethers.providers.Provider = getInfuraProvider(job.data.chain);
  const tx = await provider.getTransaction(job.data.txHash);

  if (!tx || !tx.to || tx.from !== validatorMap.get(job.data.from)) {
    const errorStatus: TxStatus = "error";
    updateTx(job.data.id, errorStatus);
    return;
  }

  // remove the new released sender from the senders in process list cache
  const senders: string[] = senderCache.get(sendersInProcessCache)!;
  const idx = senders.findIndex(s => s === job.data.from);
  const newSenders = senders.splice(idx,1);
  senderCache.set(sendersInProcessCache, newSenders);

  const successStatus: TxStatus = "success";
  updateTx(job.data.id, successStatus);
  provider.removeAllListeners();
});
