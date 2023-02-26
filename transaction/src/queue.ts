import Queue from "bull";
import Redis from "ioredis";
import {ethers} from "ethers";
import {insertTx, updateTx} from "./graphql/transaction";
import {updateOp} from "./graphql/operation";
import {processActions, buildTx} from "./operation";
import type {QueueType} from "./types";
import { getInfuraProvider } from "./utils";
import {SUPPORTED_CHAINS} from "../../functions/common";
import type {Chain} from "../../functions/common";
import {SenderPool} from "./sender";
import type { Operation } from "./types";
import {hexlContract} from "../../functions/common";

async function trySendTx(
    provider: ethers.providers.Provider,
    data: any
) : Promise<ethers.providers.TransactionResponse> {
    if (data.txHash) {
        return await provider.getTransaction(data.txHash);
    } else {
        const hash = ethers.utils.keccak256(data.tx);
        const found = await provider.getTransaction(hash);
        return found || await provider.sendTransaction(data.tx);
    }
}

const redisHost = process.env.REDIS_HOST!;
const redisPort = parseInt(process.env.REDIS_PORT!, 10);
const client: Redis = new Redis(redisPort, redisHost, {
    password: process.env.REDIS_PASSWORD!,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});
client.setMaxListeners(50);

const subscriber: Redis = new Redis(redisPort, redisHost,{
    password: process.env.REDIS_PASSWORD!,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
});
subscriber.setMaxListeners(50);

const redisOpts = {
  createClient(type: string) {
    switch (type) {
      case 'client':
        return client
      case 'subscriber':
        return subscriber
      default:
        const rClient = new Redis(redisPort, redisHost, {
            password: process.env.REDIS_PASSWORD!,
            maxRetriesPerRequest: null,
            enableReadyCheck: false
        });
        rClient.setMaxListeners(50);
        return rClient;
    }
  },
}
const queueOpts = process.env.VITE_USE_REDIS_LOCAL ? {} : redisOpts;

class PrivateQueues {
    opQueues : Map<string, Queue.Queue> = new Map<string, Queue.Queue>();
    txQueues : Map<string, Queue.Queue> = new Map<string, Queue.Queue>();
    coordinatorQueues : Map<string, Queue.Queue> = new Map<string, Queue.Queue>();
    storageQueue : Queue.Queue = new Queue("storage", queueOpts);

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
        const queue = new Queue(this.queueName(chain, "coordinator"), queueOpts);
        console.log("Initiating coordinator queue " + queue.name);
        queue.process("poll", 1, async (job) => {
            const signer = senderPool.getSenderInIdle(chain.name);
            if (signer === undefined) {
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
                senderPool.removeSenderCompletedJob(chain.name, signer.address);
                return;
            }
            const ops = jobs.map((j: any) => j.data as Operation);

            const provider = getInfuraProvider(chain);
            const postPorgress = async (j: any, txId?: number, error?: string) => {
                await updateOp(j.data.id, txId, error);
                await j.moveToCompleted("success", false, true);
            }
            try {
                const hexlink = await hexlContract(provider);
                const args = ops.map(op => op.input);
                const estimatedGas = await hexlink.estimateGas.process(args);
                const unsignedTx = await hexlink.populateTransaction.process(
                    args, {gasLimit: estimatedGas.mul(2)},
                );
                const tx = await buildTx(provider, chain, unsignedTx, signer.address);
                const signedTx = await signer.signTransaction(tx);
                const txHash = ethers.utils.keccak256(signedTx);
                const [{id}] = await insertTx([{chain: chain.name, tx: txHash}]);
                await txQueue.add({id, tx: signedTx, ops, signer: signer.address});
                await Promise.all(jobs.map(j => postPorgress(j, id)));
            } catch(err) {
                console.log(err);
                await Promise.all(jobs.map(j => postPorgress(j, undefined, "failed to insert tx")));
                senderPool.removeSenderCompletedJob(chain.name, signer.address);
            }
        });
        queue.add("poll", {}, { repeat: { every: 1000, } });
        return queue;
    }

    private initOperationQueue(chain: Chain) : Queue.Queue {
        const queue = new Queue(
            this.queueName(chain, "operation"),
            {
                settings: {maxStalledCount: 0},
                ...queueOpts
            }
        );
        console.log("Initiating operation queue " + queue.name);
        return queue;
    }

    private initTransactionQueue(chain: Chain) : Queue.Queue {
        const senderPool = SenderPool.getInstance();
        const queue = new Queue(this.queueName(chain, "transaction"), queueOpts);
        console.log("Initiating transaction queue " + queue.name);
        queue.process(async(job: any) => {
            try {
                const provider: ethers.providers.Provider = getInfuraProvider(chain);
                const tx = await trySendTx(provider, job.data);
                const receipt = await tx.wait();
                await Promise.all(job.data.ops.map(
                    (op: Operation) => processActions(chain, op, receipt)
                ));
                await updateTx(job.data.id, "success");
            } catch(err: any) {
                console.log(err);
                await updateTx(job.data.id, "error", err.message);
            }
            senderPool.removeSenderCompletedJob(chain.name, job.data.signer);
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

