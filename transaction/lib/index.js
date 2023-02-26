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
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
const port = 9999;
const queues = queue_1.Queues.getInstance();
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// parse application/json
app.use(body_parser_1.default.json());
app.use(auth_1.auth);
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
    try {
        if (req.body.tx) {
            const [{ id: txId }] = await (0, transaction_1.insertTx)([
                { tx: req.body.tx, chain: req.params.chain }
            ]);
            try {
                const [{ id: opId }] = await (0, operation_1.insertOp)([{ txId, ...input }]);
                const txQueue = queues.getTxQueue(req.params.chain);
                await txQueue.add({
                    id: txId,
                    txHash: req.body.tx,
                    ops: [{ id: opId, ...input }],
                });
                res.status(200).json({ id: opId });
            }
            catch (err) {
                console.log(err);
                await (0, transaction_1.updateTx)(txId, "error", "failed to push to tx queue");
                res.status(500).json({ err });
            }
        }
        else {
            const [{ id }] = await (0, operation_1.insertOp)([input]);
            await opQueue.add({ id, ...input });
            res.status(200).json({ id });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ err });
    }
});
// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map