import {getAuth} from "firebase-admin/auth";

export const verifiedByIdToken = async function(idToken: string) {
  return await getAuth().verifyIdToken(idToken);
};
