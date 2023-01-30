"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const queue_1 = require("./queue");
const operation_1 = require("./graphql/operation");
const app = (0, express_1.default)();
const port = 9000;
const queues = queue_1.Queues.getInstance();
app.post('/submit/:chain', async (req, _res) => {
    const opQueue = queues.getOpQueue(req.params.chain);
    const input = {
        chain: req.params.chain,
        input: req.query.op.input,
        args: req.query.op.args,
        actions: req.query.actions,
    };
    if (req.query.op.transaction) {
        input.transaction = req.query.op.transaction;
        const [{ id }] = await (0, operation_1.insertOp)([input]);
        const txQueue = queues.getTxQueue(req.params.chain);
        await txQueue.add({
            id,
            tx: req.query.op.transaction.tx,
            ops: [{ id, ...input }],
        });
    }
    else {
        const [{ id }] = await (0, operation_1.insertOp)([input]);
        await opQueue.add({ id, ...input });
    }
});
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map