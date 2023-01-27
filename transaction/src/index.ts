import express from "express";
import Queue from "bull";
import {ethers} from "ethers";
import {recordClaimTx, recordTx, updateTx} from "./operation";
import {RedPacketClaimInput, TxStatus, Operation} from "./types";
import {getChain} from "../../functions/common";
import type {Chain} from "../../functions/common";

const app = express();
const port = 8080;

const operationQueue = new Queue("operationQueue");
const transactionQueue = new Queue("transactionQueue");

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
      signedTx: req.query.signedTx as string,
      from: req.query.from as string
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
  const chain: Chain = getChain(job.data.chain);
  const provider: ethers.providers.Provider = getInfuraProvider(chain);

  const tx = buildTxFromOp(job.data.op);
  const txHash = await provider.sendTransaction(tx);

  const id = await recordTx(chain.name, job.data.tx);
  await transactionQueue.add({id, chain, txHash, from});
});

transactionQueue.process(async (job: any) => {
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
});
