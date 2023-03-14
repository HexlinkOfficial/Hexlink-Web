"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAppSetupController = void 0;
const express_validator_1 = require("express-validator");
const authAppSetupController = async (req, res) => {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const errorMessage = error.array()[0].msg;
        res.status(400).json({ message: errorMessage });
        return;
    }
    const { name, email, password } = req.body;
    const user = await User.getUser(email);
    if (user !== User.empty) {
      res.status(400).json({ message: 'This email is already used' });
      return;
    }
    const newUser = new User(name, email, hashedPassword);
    const userId = await newUser.createUser();
    const token = jwt.sign({ email: email, userId: userId }, 'mySecretKey', {
      expiresIn: '1h',
    });
    res.status(200).json({ token: token, userId: userId });
};
exports.authAppSetupController = authAppSetupController;
