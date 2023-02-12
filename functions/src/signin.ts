import {validate} from "deep-email-validator";
import sendgridMail from "@sendgrid/mail";
import {sendgridApiKey} from "./config";
import {Firebase} from "./firebase";
import * as functions from "firebase-functions";
import {getUser, insertUser, updateOTP} from "./graphql/user";
import {getAuth} from "firebase-admin/auth";

sendgridMail.setApiKey(sendgridApiKey);
const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const OTP_LEN = 6;
const expiredAfter = 10 * 60000;

export const genOTP = functions.https.onCall(async (data, context) => {
  Firebase.getInstance();
  /*
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }
  */

  const isValidEmail = await validateEmail(data.email);
  if (!isValidEmail) {
    return {code: 400, message: "Invalid email"};
  }

  const otp = randomCode(OTP_LEN);

  const user = await getUser(data.email);
  if (!user || !user.id) {
    await insertUser([{email: data.email, otp: otp}]);
  } else {
    await updateOTP({id: user.id!, otp: otp});
  }

  await sendgridMail.send({
    to: data.email,
    from: "info@hexlink.io",
    subject: "Hexlink Login Code",
    text: `Hi,\n\nYour Hexlink login code is ${otp}. The code will expire in 10 minutes.\n\nRegards,\nHexlink`,
    html: `<p>Hi,<br><br>Your Hexlink login code is <br><br><span style="color: #b58d21; font-size: 20px; font-weight: bold;">${otp}</span><br><br>The code will expire in 10 minutes.<br><br>Regards,<br>Hexlink</p>`,
  });
  return {code: 200, otp: otp, sentAt: new Date().getTime()};
});

const validateEmail = async (email: string) => {
  if (email === null) {
    return false;
  }

  return await validate({
    email,
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: true,
  });
};

const randomCode = (length: number) => {
  let code = "";
  const len = CHARS.length;
  for (let i = 0; i < length; i++ ) {
    code += CHARS[Math.floor(Math.random() * len)];
  }
  return code;
};

export const validateOTP = functions.https.onCall(async (data, context) => {
  Firebase.getInstance();
  /*
  const uid = context.auth?.uid;
  if (!uid) {
    return {code: 401, message: "Unauthorized"};
  }
  */

  if (!data.email || !data.otp) {
    return {code: 400, message: "Email or OTP is missing."};
  }

  const user = await getUser(data.email);
  if (!user || !user.id || !user.otp || !user.updated_at) {
    return {code: 400, message: "No record for the email, " + data.email};
  }

  if (user.otp === data.otp && isValidOTP(user.updated_at)) {
    const customToken = await createCustomToken(user.id);
    return {code: 200, token: customToken};
  }

  return {code: 400, message: "Invalid OTP."};
});

const isValidOTP = (updatedAt: string) => {
  const time = new Date().getTime() - new Date(updatedAt).getTime();
  return time < expiredAfter;
};

export const refreshCustomToken = functions.https.onCall(
    async (_data, context) => {
      Firebase.getInstance();
      const uid = context.auth?.uid;
      if (!uid) {
        return {code: 401, message: "Unauthorized"};
      }

      const customToken = await createCustomToken(uid);
      return {code: 200, token: customToken};
    });

const createCustomToken = async (uid: string) => {
  const claims = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-user-id": uid,
    },
  };
  return await getAuth().createCustomToken(uid, claims);
};
