import "express-async-errors";
import express from "express";
import {Queues} from "./queue";
import {insertOp} from "./graphql/operation";
import type {OperationInput, Action} from "./types";
import { insertTx } from "./graphql/transaction";

const app = express();
const port = 9000;
const queues = Queues.getInstance();

app.post('/submit/:chain', async (req: express.Request, res: express.Response) => {
  const opQueue = queues.getOpQueue(req.params.chain)!;
  if (!req.body.op) {
    res.status(400).json({success: false, message: "invalid op"});
    return;
  }
  const op = req.body.op as any;
  const input = {
    chain: req.params.chain,
    input: op.input,
    args: op.args,
    actions: (op.actions || []).map((a : string) => JSON.parse(a) as Action),
  } as OperationInput;
  if (op.tx) {
    const [{id: txId}] = await insertTx(op.tx);
    const [{id: opId}] = await insertOp([{txId, ...input}]);
    const txQueue = queues.getTxQueue(req.params.chain)!;
    await txQueue.add({
      id: opId,
      tx: op.tx.tx,
      ops: [{id: opId, ...input}],
    });
  } else {
    const [{id}] = await insertOp([input]);
    await opQueue.add({id, ...input});
  }
  res.status(200).json({ success: true });
});

// start the Express server
app.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});
