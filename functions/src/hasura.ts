import {getAuth} from "firebase-admin/auth";
import * as functions from "firebase-functions";
import {Firebase} from "./firebase";

// eslint-disable-next-line require-jsdoc
async function updateClaims(uid: string) {
  const result = await getAuth().setCustomUserClaims(uid, {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-user-id": uid,
    },
  });
  console.log("Successfully updated claims for ", uid, result);
}

export const processSignUp = functions.auth.user().onCreate((user) => {
  Firebase.getInstance();
  return updateClaims(user.uid);
});

export const refreshToken = functions.https.onCall(async (_data, context) => {
  Firebase.getInstance();
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }
  await updateClaims(String(uid));
  return {code: 200};
});
