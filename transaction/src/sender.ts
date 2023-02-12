import {ethers} from "ethers";
import cache from "node-cache";

class PrivateSenderPool {
    senders : Map<string, string>;
    senderPoolAddr : string[];
    senderCache: cache;

    constructor() {
        this.senders = new Map<string, string>(
            Object.entries(JSON.parse(process.env.TX_SENDER_POOL!)).map(
                item => [item[0].toLowerCase(), item[1] as string]
            )
        );
        this.senderPoolAddr =[ ...this.senders.keys() ].map(addr => addr.toLowerCase());
        this.senderCache = new cache();
        console.log(
            `${this.senderPoolAddr.length} senders initiated: \n${this.senderPoolAddr.join(",\n")}`
        );
        // TODO set blocked senders
    }

    size() : number {
        return this.senderPoolAddr.length;
    }

    getSenderInProcess(chain: string) : string[] {
        return this.senderCache.has(chain) ? this.senderCache.get(chain)! : [];
    }

    getSenderInIdle(chain: string) : ethers.Wallet | undefined {
        const sendersInProcess: string[] = this.getSenderInProcess(chain);
        const sendersInIdle = this.senderPoolAddr.filter(k => !sendersInProcess.includes(k));
        if (sendersInIdle.length > 0) {
            const sender = sendersInIdle[0];
            sendersInProcess.push(sender);
            this.senderCache.set(chain, sendersInProcess);
            return new ethers.Wallet(this.senders.get(sender)!);
        }
        return undefined;
    };

    removeSenderCompletedJob(chain: string, sender: string) {
        const sendersInProcess: string[] = this.getSenderInProcess(chain);
        const index = sendersInProcess.indexOf(sender.toLowerCase(), 0);
        if (index > -1) {
            this.senderCache.set(chain, sendersInProcess.splice(index, 1));
        }
    }
}

/* tslint:disable:max-classes-per-file */
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
