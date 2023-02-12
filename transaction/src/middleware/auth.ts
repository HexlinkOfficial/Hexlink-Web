
import type {Request, Response, NextFunction, RequestHandler} from "express";
import {Firebase} from "../firebase";

export const auth : RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const firebase = Firebase.getInstance();
  const authHeader = req.headers.authorization;
  if (authHeader) {
    /* Bearer xxx */
    const idToken = authHeader.split(" ")[1];
    if (idToken === process.env.TRANSACTION_SERVICE_SECRET) {
      next();
    } else {
      firebase.auth.verifyIdToken(idToken).then((decodedToken) => {
        req.body.uid = decodedToken.uid;
        next();
      }).catch((error) => {
        console.log(error);
        res.sendStatus(403);
      });
    }
  } else {
    res.sendStatus(401);
  }
};
