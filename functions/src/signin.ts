import * as EmailValidator from "node-email-validation";
import sendgridMail from "@sendgrid/mail";
import {Firebase} from "./firebase";
import * as functions from "firebase-functions";
import {getUser, insertUser, updateOTP} from "./graphql/user";
import {getAuth} from "firebase-admin/auth";
import {rateLimiter} from "./ratelimiter";
import {decryptWithSymmKey, encryptWithSymmKey} from "./kms";

const secrets = functions.config().doppler || {};
const CHARS = "0123456789";
const OTP_LEN = 6;
const expiredAfter = 10 * 60000;

export const genOTP = functions.https.onCall(async (data, context) => {
  Firebase.getInstance();
  const isValidEmail = await validateEmail(data.email);
  if (!isValidEmail) {
    return {code: 400, message: "Invalid email"};
  }

  let ip: string;
  if (process.env.FUNCTIONS_EMULATOR) {
    ip = context.rawRequest.headers.origin || "http://localhost:5173";
  } else {
    ip = context.rawRequest.ip;
  }

  const isQuotaExceeded = await rateLimiter("genOTP", `ip_${ip}`, 60, 3);
  if (isQuotaExceeded) {
    return {code: 429, message: "Too many requests of genOTP."};
  }

  const plainOTP = randomCode(OTP_LEN);
  const encryptedOTP = await encryptWithSymmKey(plainOTP);

  const user = await getUser(data.email);
  if (!user || !user.id) {
    await insertUser([{email: data.email, otp: encryptedOTP, isActive: true}]);
  } else {
    await updateOTP({id: user.id!, otp: encryptedOTP, isActive: true});
  }

  sendgridMail.setApiKey(secrets.SENDGRID_API_KEY);
  await sendgridMail.send({
    to: data.email,
    from: "info@hexlink.io",
    subject: "Hexlink Login Code",
    text: `Hi,\n\nThank you for choosing Hexlink. Use the following OTP to complete your Log in procedures. OTP is valid for 5 minute.\n${plainOTP}\n\nRegards,\nHexlink`,
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:10px auto;width:100%;padding:10px 0">
        <div style="border-bottom:1px solid #eee">
          <p href="" style="font-size:1.6em;background: #1890ff;color: #fff;text-decoration:none;font-weight:600">Hexlink</p>
        </div>
        <p style="font-size:1.5em">Hi,</p>
        <p style="font-size:1.4em">Thank you for choosing Hexlink. Use the following OTP to complete your Log in procedures. OTP is valid for 5 minutes.</p>
        <h2 style="font-size:2.5em; background: #1890ff;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${plainOTP}</h2>
        <p style="font-size:1.4em;">Regards,<br />Hexlink</p>
      </div>
    </div>`,
  });
  return {code: 200, sentAt: new Date().getTime()};
});

const validateEmail = async (email: string) => {
  if (email === null) {
    return false;
  }

  return EmailValidator.is_email_valid(email);
};

const randomCode = (length: number) => {
  let code = "";
  const len = CHARS.length;
  for (let i = 0; i < length; i++ ) {
    code += CHARS[Math.floor(Math.random() * len)];
  }
  return code;
};

export const validateOTP = functions.https.onCall(async (data, _context) => {
  Firebase.getInstance();
  if (!data.email || !data.otp) {
    return {code: 400, message: "Email or OTP is missing."};
  }

  const isQuotaExceeded = await rateLimiter("validateOTP", `email_${data.email}`, 300, 15);
  if (isQuotaExceeded) {
    return {code: 429, message: "Too many requests of validateOTP."};
  }

  const user = await getUser(data.email);
  if (!user || !user.id || !user.otp || !user.updatedAt || !user.isActive) {
    return {code: 400, message: "No record for the email, " + data.email};
  }

  const plainOTP = <string> await decryptWithSymmKey(user.otp);
  if (plainOTP === data.otp && user.isActive && isValidOTP(user.updatedAt)) {
    const customToken = await createCustomToken(user.id);
    await updateOTP({id: user.id!, otp: user.otp, isActive: false});
    return {code: 200, token: customToken};
  }

  return {code: 400, message: "Invalid OTP."};
});

const isValidOTP = (updatedAt: string) => {
  const time = new Date().getTime() - new Date(updatedAt).getTime();
  return time < expiredAfter;
};

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
