import * as EmailValidator from "node-email-validation";
import {Firebase} from "./firebase";
import * as functions from "firebase-functions";
import {getUser, insertUser, updateOTP} from "./graphql/user";
import {rateLimiter} from "./ratelimiter";
import {decryptWithSymmKey, encryptWithSymmKey, sign} from "./kms";
import formData from "form-data";
import Mailgun from "mailgun.js";
import {utils} from "ethers";
import {
  getAuthenticationNotification,
  getNewTransferNotification,
} from "./notification";

const secrets = functions.config().doppler || {};
const CHARS = "0123456789";
const OTP_LEN = 6;
const expiredAfter = 10 * 60000;

interface EmailData {
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string
}

const sendEmail = async (data: EmailData) => {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: secrets.MAILGUN_API_KEY,
  });
  await mg.messages.create("hexlink.io", data);
};

const preNotification = async (
    email: string,
    maxPerMin: number,
    context: any
) : Promise<string> => {
  email = email.toLowerCase();
  const isValidEmail = await validateEmail(email);
  if (!isValidEmail) {
    throw new Error("Invalid email");
  }

  let ip: string;
  if (process.env.FUNCTIONS_EMULATOR) {
    ip = context.rawRequest.headers.origin || "http://localhost:5173";
  } else {
    ip = context.rawRequest.ip;
  }

  const isQuotaExceeded = await rateLimiter("notify transfer", `ip_${ip}`, 60, maxPerMin);
  if (isQuotaExceeded) {
    throw new Error("rate limited");
  }
  return email;
};

export const notifyTransfer = functions.https.onCall(async (data, context) => {
  Firebase.getInstance();
  try {
    const sender = await preNotification(data.sender, 3, context);
    const user = await getUser(data.sender);
    if (!user || !user.id) {
      return {code: 400, message: "user not exists"};
    }

    await sendEmail(getNewTransferNotification(
        sender,
        data.receiver,
        data.token,
        data.sendAmount,
    ));
    return {code: 200, sentAt: new Date().getTime()};
  } catch (e: any) {
    console.log(e);
    return {code: 400, message: e.message};
  }
});

export const genOTP = functions.https.onCall(async (data, context) => {
  Firebase.getInstance();
  try {
    const email = await preNotification(data.email, 3, context);
    const plainOTP = randomCode(OTP_LEN);
    const encryptedOTP = await encryptWithSymmKey(plainOTP);

    const user = await getUser(data.email);
    if (!user || !user.id) {
      await insertUser(
          [{email: data.email, otp: encryptedOTP, isActive: true}]);
    } else {
      await updateOTP({id: user.id!, otp: encryptedOTP, isActive: true});
    }

    await sendEmail(getAuthenticationNotification(email, plainOTP));
    return {code: 200, sentAt: new Date().getTime()};
  } catch (e: any) {
    console.log(e);
    return {code: 400, message: e.message};
  }
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

export const validateOTP = functions.https.onCall(async (data) => {
  Firebase.getInstance();
  data.email = data.email.toLowerCase();
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
    await updateOTP({id: user.id!, otp: user.otp, isActive: false});
    const name = `mailto:${data.email}`;
    const nameHash = utils.keccak256(utils.toUtf8Bytes(name));
    const signature = await sign(nameHash, data.message);
    return {code: 200, signature};
  }

  return {code: 400, message: "Invalid OTP."};
});

const isValidOTP = (updatedAt: string) => {
  const time = new Date().getTime() - new Date(updatedAt).getTime();
  return time < expiredAfter;
};
