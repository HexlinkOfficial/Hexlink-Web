import express from "express";
import Queue from "bull";
import cache from "node-cache";
import {ethers} from "ethers";
import {recordClaimTx, recordTx, updateTx} from "./operation";
import {RedPacketClaimInput, TxStatus, Operation} from "./types";
import {getChain} from "../../functions/common";
import type {Chain} from "../../functions/common";

const app = express();
const port = 8080;

const operationQueue = new Queue("operationQueue");
const transactionQueue = new Queue("transactionQueue");
const senderCache = new cache();

export const senderPool: Map<string, string> = JSON.parse(process.env.TX_SENDER_POOL!);
export const senderPoolAddr =[ ...senderPool.keys() ];

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

const getSenderInProcess = (chainStr: string) : string[] => {
  return senderCache.has(chainStr) ? senderCache.get(chainStr)! : [];
}

const getSenderInIdle = (chainStr: string) => {
  const chain: Chain = getChain(chainStr);
  const provider: ethers.providers.Provider = getInfuraProvider(chain);
  const sendersInProcess: string[] = getSenderInProcess(chainStr);
  const sendersInIdle = senderPoolAddr.filter(k => !sendersInProcess.includes(k));
  
  if (sendersInIdle.length > 0) {
    return new ethers.Wallet(senderPool.get(sendersInIdle[0])!, provider);
  }

  return;
};

const addSenderAssignedTx = (chainStr: string, sender: string) => {
  const sendersInProcess: string[] = getSenderInProcess(chainStr);
  senderCache.set(chainStr, sendersInProcess.push(sender));
}

const removeSenderCompletedJob = (chainStr: string, sender: string) => {
  const sendersInProcess: string[] = getSenderInProcess(chainStr);

  const index = sendersInProcess.indexOf(sender, 0);
  if (index > -1) {
    senderCache.set(chainStr, sendersInProcess.splice(index, 1));
  }
}

operationQueue.process(async (job: any) => {
  const chain: Chain = getChain(job.data.chain);
  const provider: ethers.providers.Provider = getInfuraProvider(chain);
  const signer = getSenderInIdle(job.data.chain);
  if (!signer) {
    return;
  }

  const tx = buildTxFromOp(job.data.op);
  const txHash = await provider.sendTransaction(tx);

  const id = await recordTx(chain.name, job.data.tx);
  await transactionQueue.add({id, chain, txHash, signer});

  // cache the new occupied sender to the senders in process list
  addSenderAssignedTx(job.data.chain, signer.address);
});

transactionQueue.process(async (job: any) => {
  const provider: ethers.providers.Provider = getInfuraProvider(job.data.chain);
  const tx = await provider.getTransaction(job.data.txHash);

  if (!tx || !tx.to || tx.from !== job.data.signer.address) {
    const errorStatus: TxStatus = "error";
    updateTx(job.data.id, errorStatus);
    return;
  }

  // remove the new released sender from the senders in process list cache
  removeSenderCompletedJob(job.data.chain, job.data.signer.address);

  const successStatus: TxStatus = "success";
  updateTx(job.data.id, successStatus);
  provider.removeAllListeners();
});
