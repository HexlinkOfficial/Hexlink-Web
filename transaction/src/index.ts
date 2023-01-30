import "express-async-errors";
import express from "express";
import {Queues} from "./queue";
import {insertOp} from "./graphql/operation";

const app = express();
const port = 8080;
const queues = Queues.getInstance();

app.post('/submit/:chain', async (req: any, _res) => {
  const opQueue = queues.getOpQueue(req.params.chain)!;
  await insertOp(req.query.op);
  if (req.query.op.transaction) {
    const txQueue = queues.getTxQueue(req.params.chain)!;
    await txQueue.add({
      ops: [req.query.op],
      tx: req.query.op.transaction
    });
  } else {
    await opQueue.add({op: req.query.op});
  }
});

// start the Express server
app.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});
