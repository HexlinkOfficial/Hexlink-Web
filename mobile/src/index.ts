import express, { Application, Request, Response } from 'express';
import authRouter from './router/auth-router';

const app: Application = express();

app.use(express.json());

app.use('/auth-app', authRouter);

app.listen(8017);