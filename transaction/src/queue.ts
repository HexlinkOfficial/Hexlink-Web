import Queue from "bull";
import {ethers} from "ethers";
import {recordTx, updateTx} from "./operation";
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
        });
    }
    
    private queueName(chain: Chain, type: QueueType) {
        return chain.name + "_" + type;
    }

    private buildTxFromOps(ops: any): string {
        return "";
    }

    private initOperationQueue(chain: Chain, txQueue: Queue.Queue) : Queue.Queue {
        const senderPool = SenderPool.getInstance();
        const queue = new Queue(this.queueName(chain, "operation"));
        queue.process(async (job: any) => {
            const signer = senderPool.getSenderInIdle(chain);
            if (!signer) {
                return;
            }
            
            const provider: ethers.providers.Provider = getInfuraProvider(chain);
            const ops = await queue.getJobs(['waiting'], 0, 100);
            const tx: string = this.buildTxFromOps(ops);
            const txHash = await provider.sendTransaction(tx);
            const id = await recordTx(chain.name, job.data.tx);
            txQueue.add({id, txHash})
            // cache the new occupied sender to the senders in process list
            senderPool.addSenderAssignedTx(chain, signer.address);
        });
        queue.add(null, { repeat: { every: 1000, } });
        return queue;
    }
        
    private initTransactionQueue(chain: Chain) : Queue.Queue {
        const senderPool = SenderPool.getInstance();
        const queue = new Queue(this.queueName(chain, "transaction"));
        queue.process(async(job: any) => {});
        const postProcessor = async (job: any) => {
            const provider: ethers.providers.Provider = getInfuraProvider(job.data.chain);
            const tx = await provider.getTransaction(job.data.txHash);
            
            if (!tx || !tx.to || tx.from !== job.data.signer.address) {
                const errorStatus: TxStatus = "error";
                updateTx(job.data.id, errorStatus);
                return;
            }
            
            // remove the new released sender from the senders in process list cache
            senderPool.removeSenderCompletedJob(chain, job.data.signer.address);
            
            const successStatus: TxStatus = "success";
            updateTx(job.data.id, successStatus);
            provider.removeAllListeners();
        }
        queue.on("completed", postProcessor);
        queue.on("failed", postProcessor);
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
  
