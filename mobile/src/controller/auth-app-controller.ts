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

  res.status(200).json({ address: address });
};