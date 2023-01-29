import express from "express";
import {Queues} from "./queue";
import type {Operation} from "./types";

const app = express();
const port = 8080;

app.post('/submitTx', async (req: {
  query: {chain: string, op: Operation}
}, _res) => {
  const queues = Queues.getInstance();
  await queues.getOpQueue(req.query.chain as string)!.add({
    chain: req.query.chain,
    op: req.query.op,
  });
});

// start the Express server
app.listen(port, () => {
  console.log( `server started at http://localhost:${ port }` );
});

