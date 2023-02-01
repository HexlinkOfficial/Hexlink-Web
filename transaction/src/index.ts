import "express-async-errors";
import express from "express";
import {Queues} from "./queue";
import {insertOp} from "./graphql/operation";
import type {OperationInput} from "./types";
import { insertTx } from "./graphql/transaction";
import bodyParser from "body-parser";

const app = express();
const port = 9000;
const queues = Queues.getInstance();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.post('/submit/:chain', async (req: express.Request, res: express.Response) => {
  const opQueue = queues.getOpQueue(req.params.chain)!;
  if (!req.body.op) {
    res.status(400).json({success: false, message: "invalid op"});
    return;
  }

  const input = {
    chain: req.params.chain,
    userId: req.body.userId,
    input: req.body.op,
    actions: req.body.actions,
    type: req.body.type,
  } as OperationInput;
  if (req.body.tx) {
    const [{id: txId}] = await insertTx([
      {tx: req.body.tx, chain: req.params.chain}
    ]);
    const [{id: opId}] = await insertOp([{txId, ...input}]);
    const txQueue = queues.getTxQueue(req.params.chain)!;
    await txQueue.add({
      id: txId,
      tx: req.body.tx,
      ops: [{id: opId, ...input}],
    });
    res.status(200).json({ id: opId });
  } else {
    const [{id}] = await insertOp([input]);
    await opQueue.add({id, ...input});
    res.status(200).json({ id });
  }
});

// start the Express server
app.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});
