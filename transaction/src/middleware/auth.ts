import type {Request, Response, NextFunction, RequestHandler} from "express";

export const auth : RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    if (authHeader === process.env.TRANSACTION_SERVICE_SECRET) {
      next();
    }
  } else {
    res.sendStatus(401);
  }
};
