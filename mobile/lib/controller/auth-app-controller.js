"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAppSetupController = void 0;
const express_validator_1 = require("express-validator");
const authAppSetupController = async (req, res) => {
    const error = (0, express_validator_1.validationResult)(req);
    console.log('test');
    if (!error.isEmpty()) {
        const errorMessage = error.array()[0].msg;
        res.status(400).json({ message: errorMessage });
        return;
    }
    const { address } = req.body;
    res.status(200).json({ address: address });
};
exports.authAppSetupController = authAppSetupController;
