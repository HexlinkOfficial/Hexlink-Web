import {getAuth} from "firebase-admin/auth";
import * as functions from "firebase-functions";

export const createWallet = functions.https.onCall(async (_data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }
  const email = (await getAuth().getUser(uid)).email;
  if (email) {
    return {code: 200, email};
  } else {
    return {code: 400, message: "email not set"};
  }
});
