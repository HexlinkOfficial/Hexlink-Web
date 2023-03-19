import express, { Application, Request, Response } from 'express';
import authRouter from './router/auth-router';
import * as authAppController from './controller/auth-app-controller';

const app: Application = express();

app.use(express.json());

app.use('/auth-app', authAppController.authAppSetupController);

app.listen(8017);