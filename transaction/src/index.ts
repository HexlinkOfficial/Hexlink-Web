import "express-async-errors";
import express from "express";
import {Queues} from "./queue";
import {insertOp} from "./graphql/operation";
import type {OperationInput} from "./types";

const app = express();
const port = 8080;
const queues = Queues.getInstance();

app.post('/submit/:chain', async (req: any, _res) => {
  const opQueue = queues.getOpQueue(req.params.chain)!;
  const input = {
    chain: req.params.chain,
    input: req.query.op.input,
    args: req.query.op.args,
    actions: req.query.actions,
  } as OperationInput;
  if (req.query.op.transaction) {
    input.transaction = req.query.op.transaction;
    const [{id}] = await insertOp([input]);
    const txQueue = queues.getTxQueue(req.params.chain)!;
    await txQueue.add({
      id,
      tx: req.query.op.transaction.tx,
      ops: [{id, ...input}],
    });
  } else {
    const [{id}] = await insertOp([input]);
    await opQueue.add({id, ...input});
  }
});

// start the Express server
app.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});
