import Queue from "bull";
import {ethers} from "ethers";
import {insertTx, updateTx} from "./graphql/transaction";
import {updateOp} from "./graphql/operation";
import {buildTxFromOps, processActions} from "./operation";
import type {QueueType} from "./types";
import { getInfuraProvider } from "./utils";
import {SUPPORTED_CHAINS} from "../../functions/common";
import type {Chain} from "../../functions/common";
import {SenderPool} from "./sender";
import type { Operation } from "./types";

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

            const jobs = await queue.getJobs(['waiting'], 0, 100);
            if (jobs.length === 0) { return; }
            const ops = jobs.map((j: any) => j.data as Operation);

            const provider = getInfuraProvider(chain);
            const signedTx: string = await buildTxFromOps(
                provider, ops.map(op => op.input), signer
            );
            const txHash = ethers.utils.keccak256(signedTx);
            const [{id}] = await insertTx([{chain: chain.name, tx: txHash}]);
            senderPool.addSenderAssignedTx(chain, signer.address);
            try {
                await provider.sendTransaction(signedTx);
                txQueue.add({id, tx: txHash, ops, signer: signer.address});
            } catch(err) {
                console.log(err);
                await updateTx(id, "error");
                senderPool.removeSenderCompletedJob(chain, job.data.signer);
            }
            await Promise.all(
                jobs.map(j => j.moveToCompleted(id.toString(), false, true))
            );
        });
        queue.on("completed", async(job, txId) => {
            await updateOp(job.data.id, Number(txId));
        })
        queue.add({}, { jobId: 'poll', repeat: { every: 1000, } });
        return queue;
    }

    private initTransactionQueue(chain: Chain) : Queue.Queue {
        const senderPool = SenderPool.getInstance();
        const queue = new Queue(this.queueName(chain, "transaction"));
        queue.process(async(job: any) => {
            const provider = getInfuraProvider(chain);
            const tx = await provider.getTransaction(job.data.tx);
            const receipt = await tx.wait();
            await Promise.all(job.data.ops.map(
                (op: Operation) => processActions(op.actions, receipt)
            ));
        });
        const onSuccess = async (job: any) => {
            if (job.data.signer) {
                senderPool.removeSenderCompletedJob(chain, job.data.signer);
            }
            await updateTx(job.data.id, "success");
        }
        const onFail = async (job: any) => {
            if (job.data.signer) {
                senderPool.removeSenderCompletedJob(chain, job.data.signer);
            }
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

/* tslint:disable:max-classes-per-file */
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

