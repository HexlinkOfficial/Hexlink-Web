import Queue from "bull";
import {ethers} from "ethers";
import {insertTx, updateTx} from "./graphql/transaction";
import {updateOp} from "./graphql/operation";
import {processActions, buildTxFromOps} from "./operation";
import type {QueueType} from "./types";
import { getInfuraProvider } from "./utils";
import {SUPPORTED_CHAINS} from "../../functions/common";
import type {Chain} from "../../functions/common";
import {SenderPool} from "./sender";
import type { Operation } from "./types";

class PrivateQueues {
    opQueues : Map<string, Queue.Queue> = new Map<string, Queue.Queue>();
    txQueues : Map<string, Queue.Queue> = new Map<string, Queue.Queue>();
    coordinatorQueues : Map<string, Queue.Queue> = new Map<string, Queue.Queue>();

    constructor() {
        SUPPORTED_CHAINS.forEach(chain => {
          const txQueue = this.initTransactionQueue(chain);
          this.txQueues.set(chain.name, txQueue);
          const opQueue = this.initOperationQueue(chain);
          this.opQueues.set(chain.name, opQueue);
          const coordinatorQueue = this.initCoordinatorQueue(chain, opQueue, txQueue);
          this.coordinatorQueues.set(chain.name, coordinatorQueue);
          // TODO recover pending operations and transactions from database
        });
    }

    private queueName(chain: Chain, type: QueueType) {
        return chain.name + "_" + type;
    }

    private initCoordinatorQueue(
        chain: Chain,
        opQueue: Queue.Queue,
        txQueue: Queue.Queue
    ) : Queue.Queue {
        const senderPool = SenderPool.getInstance();
        const queue = new Queue(this.queueName(chain, "coordinator"));
        console.log("Initiating coordinator queue " + queue.name);
        queue.process("poll", senderPool.size(), async (job) => {
            const signer = senderPool.getSenderInIdle(chain);
            if (!signer) {
                console.log("No signer available...");
                return;
            }

            const jobs = [];
            for (let i = 0; i < 50; i++) {
                const j = await opQueue.getNextJob();
                if (!j) { break; }
                jobs.push(j);
            }
            if (jobs.length === 0) {
                return;
            }
            const ops = jobs.map((j: any) => j.data as Operation);

            const provider = getInfuraProvider(chain);
            const signedTx: string = await buildTxFromOps(
                provider, ops.map(op => op.input), signer
            );
            const txHash = ethers.utils.keccak256(signedTx);
            try {
                const [{id}] = await insertTx([{chain: chain.name, tx: txHash}]);
                senderPool.addSenderAssignedTx(chain, signer.address);
                try {
                    await provider.sendTransaction(signedTx);
                    await txQueue.add({id, tx: txHash, ops, signer: signer.address});
                } catch(err) {
                    console.log(err);
                    await updateTx(id, "error", "failed to send tx");
                    senderPool.removeSenderCompletedJob(chain, signer.address);
                }
                const postPorgress = async (j: any) => {
                    await updateOp(j.data.id, id);
                    await j.moveToCompleted("success", false, true);
                }
                await Promise.all(jobs.map(j => postPorgress(j)));
            } catch(err) {
                console.log(err);
                const postPorgress = async (j: any) => {
                    await updateOp(j.data.id, undefined, "failed to store tx");
                    await j.moveToCompleted("success", false, true);
                }
                await Promise.all(jobs.map(j => postPorgress(j)));
            }
        });
        queue.add("poll", {}, { repeat: { every: 1000, } });
        return queue;
    }

    private initOperationQueue(chain: Chain) : Queue.Queue {
        const queue = new Queue(
            this.queueName(chain, "operation"),
            { settings: {maxStalledCount: 0} }
        );
        console.log("Initiating operation queue " + queue.name);
        return queue;
    }

    private initTransactionQueue(chain: Chain) : Queue.Queue {
        const senderPool = SenderPool.getInstance();
        const queue = new Queue(this.queueName(chain, "transaction"));
        console.log("Initiating transaction queue " + queue.name);
        queue.process(async(job: any) => {
            const provider = getInfuraProvider(chain);
            try {
                const tx = await provider.getTransaction(job.data.tx);
                if (!tx) {
                    throw new Error("tx not found");
                }
                const receipt = await tx.wait();
                await updateTx(job.data.id, "success");
                await Promise.all(job.data.ops.map(
                    (op: Operation) => processActions(chain, op, receipt)
                ));
            } catch(err: any) {
                await updateTx(job.data.id, "error", err.message);
            }
            senderPool.removeSenderCompletedJob(chain, job.data.signer);
        });
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

