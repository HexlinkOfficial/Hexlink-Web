import {getAuth} from "firebase-admin/auth";
import * as functions from "firebase-functions";

export const deployWallet = functions.https.onCall(async (_data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }

  const user = await getAuth().getUser(uid);
  return {code: 200, txHash: ""};
});
