import {ethers} from "ethers";
import cache from "node-cache";
import type {Chain} from "../../functions/common";
import {getInfuraProvider} from "./utils";

class PrivateSenderPool {
    senders : Map<string, string>;
    senderPoolAddr : string[];
    senderCache: cache;

    constructor() {
        this.senders = JSON.parse(process.env.TX_SENDER_POOL!);
        this.senderPoolAddr =[ ...this.senders.keys() ]
        this.senderCache = new cache();
    }

    getSenderInProcess(chain: Chain) : string[] {
        return this.senderCache.has(chain.name) ? this.senderCache.get(chain.name)! : [];
    }

    getSenderInIdle(chain: Chain) : ethers.Wallet | undefined {
        const provider: ethers.providers.Provider = getInfuraProvider(chain);
        const sendersInProcess: string[] = this.getSenderInProcess(chain);
        const sendersInIdle = this.senderPoolAddr.filter(k => !sendersInProcess.includes(k));
        if (sendersInIdle.length > 0) {
            return new ethers.Wallet(this.senders.get(sendersInIdle[0])!, provider);
        }
        return;
    };

    addSenderAssignedTx(chain: Chain, sender: string) {
        const sendersInProcess: string[] = this.getSenderInProcess(chain);
        this.senderCache.set(chain.name, sendersInProcess.push(sender));
    }

    removeSenderCompletedJob(chain: Chain, sender: string) {
        const sendersInProcess: string[] = this.getSenderInProcess(chain);
    
        const index = sendersInProcess.indexOf(sender, 0);
        if (index > -1) {
            this.senderCache.set(chain.name, sendersInProcess.splice(index, 1));
        }
    }
}

export class SenderPool {
    private static instance : PrivateSenderPool;

    private constructor() {
      throw new Error("Use SenderPool.getInstance()");
    }
  
    static getInstance() {
      if (!SenderPool.instance) {
        SenderPool.instance = new PrivateSenderPool();
      }
      return SenderPool.instance;
    }
}
  