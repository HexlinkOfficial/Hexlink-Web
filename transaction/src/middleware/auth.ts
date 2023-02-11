import * as admin from "firebase-admin";
import type {Request, Response, NextFunction, RequestHandler} from "express";

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIAL_JSON!);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth : RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    /* Bearer xxx */
    const idToken = authHeader.split(" ")[1];
    if (idToken === process.env.TRANSACTION_SERVICE_SECRET) {
      next();
    } else {
      admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        req.body.uid = decodedToken.uid;
        next();
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(403);
      });
    }
  } else {
    res.sendStatus(401);
  }
};
