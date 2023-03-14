"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./router/auth-router"));
const app = (0, express_1.default)();
app.get('/auth-app', (req, res) => {
    res.status(200).json({ message: 'init successfully' });
});
app.use(express_1.default.json());
app.use('/auth-app', auth_router_1.default);
app.listen(8017);
