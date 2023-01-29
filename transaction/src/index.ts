import express from "express";
import Queue from "bull";
import {ethers} from "ethers";
import {recordClaimTx, recordTx, updateTx} from "./operation";
import {RedPacketClaimInput, TxStatus, Operation} from "./types";
import {getChain} from "../../functions/common";
import type {Chain} from "../../functions/common";

const app = express();
const port = 8080;

const operationQueues: {[key: string]: Queue.Queue} = {
  "mumbai": new Queue("mumbaiOpQueue"),
  "goerli": new Queue("goerliOpQueue"),
};
const transactionQueues: {[key: string]: Queue.Queue} = {
  "mumbai": new Queue("mumbaiTxQueue"),
  "goerli": new Queue("goerliTxQueue"),
};
const txStatusQueue = new Queue("txStatusQueue");

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
  await operationQueues[req.query.chain as string].add({
      id,
      chain: req.query.chain as string,
      signedTx: req.query.signedTx as string,
      from: req.query.from as string
  });
});

app.post('/submitTx', async (req: {
  query: {chain: string, op: Operation}
}, _res) => {
  await operationQueues[req.query.chain as string].add({
    chain: req.query.chain,
    op: req.query.op,
  });
});

// start the Express server
app.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});

const getSender = async (chain: Chain) => {
  return undefined;
};

const buildTxFromOps = (ops: any[]) : string => {
  return "";
};

const processor = async (job: any) => {
  const chain: Chain = getChain(job.data.chain);
  const sender = await getSender(chain);
  if (!sender) { return; }

  const provider: ethers.providers.Provider = getInfuraProvider(chain);
  const opQueue = operationQueues[job.data.chain as string];
  const ops = await opQueue.getJobs(['waiting'], 0, 100);

  const tx: string = buildTxFromOps(ops);
  const txHash = await provider.sendTransaction(tx);
  const id = await recordTx(chain.name, job.data.tx);
  await txStatusQueue.add({id, chain, txHash});
}

transactionQueues["mumbai"].process(processor);
transactionQueues["goerli"].process(processor);
transactionQueues["mumbai"].add(
  {chain: "mumbai"},
  { repeat: { every: 1000, } }
);
transactionQueues["goerli"].add(
  {chain: "goerli"},
  { repeat: { every: 1000, }
});

const postProcessor = async (job: any) => {
  const provider: ethers.providers.Provider = getInfuraProvider(job.data.chain);
  const tx = await provider.getTransaction(job.data.txHash);

  if (!tx || !tx.to || tx.from !== job.data.from) {
    const errorStatus: TxStatus = "error";
    updateTx(job.data.id, errorStatus);
    return;
  }

  const successStatus: TxStatus = "success";
  updateTx(job.data.id, successStatus);
  provider.removeAllListeners();
}

transactionQueues["mumbai"].on('completed', postProcessor);
transactionQueues["goerli"].on('completed', postProcessor);