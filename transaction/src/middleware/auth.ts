import type {Request, Response, NextFunction, RequestHandler} from "express";

export const auth : RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === process.env.TRANSACTION_SERVICE_SECRET) {
      next();
  } else {
    console.log("Invalid auth header");
    res.sendStatus(401);
  }
};
