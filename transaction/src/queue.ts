import Queue from "bull";
import {ethers} from "ethers";
import {insertTx, updateTx} from "./graphql/transaction";
import {updateOp} from "./graphql/operation";
import {buildTxFromOps} from "./operation";
import type {TxStatus, QueueType} from "./types";
import { getInfuraProvider } from "./utils";
import {SUPPORTED_CHAINS} from "../../functions/common";
import type {Chain} from "../../functions/common";
import {SenderPool} from "./sender";

class PrivateQueues {
    opQueues : Map<string, Queue.Queue> = new Map<string, Queue.Queue>();
    txQueues : Map<string, Queue.Queue> = new Map<string, Queue.Queue>();

    constructor() {
        SUPPORTED_CHAINS.forEach(chain => {
          const txQueue = this.initTransactionQueue(chain);
          this.txQueues.set(chain.name, txQueue);
          const opQueue = this.initOperationQueue(chain, txQueue);
          this.opQueues.set(chain.name, opQueue);
          // TODO recover pending operations and transactions from database
        });
    }
    
    private queueName(chain: Chain, type: QueueType) {
        return chain.name + "_" + type;
    }

    private initOperationQueue(chain: Chain, txQueue: Queue.Queue) : Queue.Queue {
        const senderPool = SenderPool.getInstance();
        const queue = new Queue(this.queueName(chain, "operation"));
        queue.process("poll", senderPool.size(), async (job: any) => {
            const signer = senderPool.getSenderInIdle(chain);
            if (!signer) { return; }

            const ops = await queue.getJobs(['waiting'], 0, 100);
            if (ops.length == 0) { return; }

            const tx: string = buildTxFromOps(chain, ops, signer);
            senderPool.addSenderAssignedTx(chain, signer.address);
            const [{id}] = await insertTx([{chain: chain.name, tx: tx.hash}]);
            txQueue.add({id, tx, ops, signer: signer.address});
            await Promise.all(ops.map(op => op.moveToCompleted("", false, true)));
        });
        queue.add({}, { jobId: 'poll', repeat: { every: 1000, } });
        return queue;
    }

    private initTransactionQueue(chain: Chain) : Queue.Queue {
        const senderPool = SenderPool.getInstance();
        const queue = new Queue(this.queueName(chain, "transaction"));
        queue.process(async(job: any) => {
            const provider: ethers.providers.Provider = getInfuraProvider(chain);
            const tx = await provider.sendTransaction(job.data.tx);
            return await tx.wait();
        });
        const onSuccess = async (job: any) => {
            senderPool.removeSenderCompletedJob(chain, job.data.signer);
            await updateTx(job.data.id, "success");
        }
        const onFail = async (job: any) => {
            senderPool.removeSenderCompletedJob(chain, job.data.signer);
            await updateTx(job.data.id, "error");
        };
        queue.on("completed", onSuccess);
        queue.on("failed", onFail);
        return queue;
    }

    getTxQueue(chain: string) : Queue.Queue | undefined {
        return this.txQueues.get(chain);
    }

    getOpQueue(chain: string) : Queue.Queue | undefined {
        return this.opQueues.get(chain);
    }
}

export class Queues {
    private static instance : PrivateQueues;

    private constructor() {
      throw new Error("Use Queues.getInstance()");
    }
  
    static getInstance() {
      if (!Queues.instance) {
        Queues.instance = new PrivateQueues();
      }
      return Queues.instance;
    }
}
  
