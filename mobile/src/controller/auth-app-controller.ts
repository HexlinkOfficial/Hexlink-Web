import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const authAppSetupController = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const errorMessage = error.array()[0].msg;
    res.status(400).json({ message: errorMessage });
    return;
  }

  const { address } = req.body;
  const { notifiToken } = req.body;

  //TO-DO: store the address to Chain
  res.status(200).json({ address: address, notifiToken: notifiToken});
};