import "express-async-errors";
import express from "express";
import {Queues} from "./queue";
import {insertOp} from "./graphql/operation";
import type {OperationInput} from "./types";
import { insertTx, updateTx } from "./graphql/transaction";
import bodyParser from "body-parser";
import {auth} from "./middleware/auth";

const app = express();
const port = 9999;
const queues = Queues.getInstance();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(auth)

app.post('/submit/:chain', async (req: express.Request, res: express.Response) => {
  console.log("Received submit request.");
  const opQueue = queues.getOpQueue(req.params.chain)!;
  if (!req.body.input && !req.body.tx) {
    res.status(400).json({
      success: false,
      message: "Neither op nor tx is set"
    });
    return;
  }

  const input = {
    chain: req.params.chain,
    ...req.body
  } as OperationInput;

  try {
    if (req.body.tx) {
      const [{id: txId}] = await insertTx([
        {tx: req.body.tx, chain: req.params.chain}
      ]);
      try {
        const [{id: opId}] = await insertOp([{txId, ...input}]);
        const txQueue = queues.getTxQueue(req.params.chain)!;
        await txQueue.add({
          id: txId,
          txHash: req.body.tx,
          ops: [{id: opId, ...input}],
        });
        res.status(200).json({ id: opId });
      } catch(err) {
        console.log(err);
        await updateTx(txId, "error", "failed to push to tx queue");
        res.status(500).json({ err });
      }
    } else {
      const [{id}] = await insertOp([input]);
      await opQueue.add({id, ...input});
      res.status(200).json({ id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }

});

// start the Express server
app.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});
