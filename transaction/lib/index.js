"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const queue_1 = require("./queue");
const operation_1 = require("./graphql/operation");
const transaction_1 = require("./graphql/transaction");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 9000;
const queues = queue_1.Queues.getInstance();
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.post('/submit/:chain', async (req, res) => {
    const opQueue = queues.getOpQueue(req.params.chain);
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
    };
    if (req.body.tx) {
        const [{ id: txId }] = await (0, transaction_1.insertTx)([
            { tx: req.body.tx, chain: req.params.chain }
        ]);
        const [{ id: opId }] = await (0, operation_1.insertOp)([{ txId, ...input }]);
        const txQueue = queues.getTxQueue(req.params.chain);
        await txQueue.add({
            id: txId,
            tx: req.body.tx,
            ops: [{ id: opId, ...input }],
        });
        res.status(200).json({ id: opId });
    }
    else {
        const [{ id }] = await (0, operation_1.insertOp)([input]);
        await opQueue.add({ id, ...input });
        res.status(200).json({ id });
    }
});
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map