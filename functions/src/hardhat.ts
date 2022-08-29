import {getAuth} from "firebase-admin/auth";
import * as functions from "firebase-functions";
import * as hre from "hardhat";

export const createWallet = functions.https.onCall(async (_data, context) => {
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }
  const email = (await getAuth().getUser(uid)).email;
  if (email) {
    const txHash = await hre.run("clone", {async: true, email});
    return {code: 200, txHash};
  } else {
    return {code: 400, message: "email not set"};
  }
});
