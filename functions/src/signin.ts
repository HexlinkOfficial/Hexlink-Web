import * as EmailValidator from "node-email-validation";
import {Firebase} from "./firebase";
import * as functions from "firebase-functions";
import {getUserById, insertUser, updateOTP} from "./graphql/user";
import {rateLimiter} from "./ratelimiter";
import {decryptWithSymmKey, encryptWithSymmKey, sign} from "./kms";
import formData from "form-data";
import Mailgun from "mailgun.js";
import {utils} from "ethers";
import {
  getAuthenticationNotification,
  getNewTransferNotification,
} from "./notification";
import {parsePhoneNumber, isValidPhoneNumber} from "libphonenumber-js";

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

function genUserId(data: {schema: string, receiver: string}) : string {
  let userId: string;
  if (data.schema === "mailto") {
    const email = data.receiver.toLowerCase();
    if (!validateEmail(email)) {
      throw new Error("invalid_email");
    }
    userId = `mailto:${email}`;
  } else if (data.schema === "tel") {
    if (!isValidPhoneNumber(data.receiver)) {
      throw new Error("invalid_phone_number");
    }
    const phoneNumber = parsePhoneNumber(data.receiver);
    userId = phoneNumber.getURI();
  } else {
    throw new Error("missing_receipt");
  }
  return userId;
}

async function sendOtpRateLimit(
    maxPerMin: number,
    context: any
) {
  let ip: string;
  if (process.env.FUNCTIONS_EMULATOR) {
    ip = context.rawRequest.headers.origin || "http://localhost:5173";
  } else {
    ip = context.rawRequest.ip;
  }
  const isQuotaExceeded = await rateLimiter("send_otp", `ip_${ip}`, 60, maxPerMin);
  if (isQuotaExceeded) {
    throw new Error("rate_limited");
  }
}

const sendEmail = async (data: EmailData) => {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: secrets.MAILGUN_API_KEY,
  });
  await mg.messages.create("hexlink.io", data);
};

export const notifyTransfer = functions.https.onCall(async (data, context) => {
  Firebase.getInstance();
  try {
    const userId = genUserId(data);
    await sendOtpRateLimit(3, context);
    const user = await getUserById(userId);
    if (!user || !user.id) {
      return {code: 400, message: "user not exists"};
    }

    if (data.schema === "mailto") {
      await sendEmail(getNewTransferNotification(
          data.sender,
          data.receiver,
          data.token,
          data.sendAmount,
      ));
    } else {
      // TODO: send sms notification
    }
    return {code: 200, sentAt: new Date().getTime()};
  } catch (e: any) {
    console.log(e);
    const code = e.message === "rate_limited" ? 429 : 400;
    return {code, message: e.message};
  }
});

export const genAndSendOTP = functions.https.onCall(async (data, context) => {
  Firebase.getInstance();
  try {
    const userId = genUserId(data);
    await sendOtpRateLimit(3, context);
    const plainOTP = randomCode(OTP_LEN);
    const encryptedOTP = await encryptWithSymmKey(plainOTP);

    const user = await getUserById(userId);
    if (!user || !user.id) {
      await insertUser([{id: userId, otp: encryptedOTP}]);
    } else {
      await updateOTP({id: userId, otp: encryptedOTP, isActive: true});
    }

    if (data.schema === "mailto") {
      await sendEmail(getAuthenticationNotification(data.receiver, plainOTP));
    } else {
      // TODO: send sms otp here
    }
    return {code: 200, sentAt: new Date().getTime()};
  } catch (e: any) {
    console.log(e);
    const code = e.message === "rate_limited" ? 429 : 400;
    return {code, message: e.message};
  }
});

export const validateOTP = functions.https.onCall(async (data) => {
  Firebase.getInstance();
  const userId = genUserId(data.userId);
  if (!data.otp) {
    return {code: 400, message: "Email or OTP is missing."};
  }
  const isQuotaExceeded = await rateLimiter(
      "validate_otp", userId, 300, 10
  );
  if (isQuotaExceeded) {
    return {code: 429, message: "too many requests"};
  }

  const user = await getUserById(userId);
  if (!user || !user.otp || !user.updatedAt || !user.isActive) {
    return {code: 400, message: "No record for the userId, " + userId};
  }

  const plainOTP = <string> await decryptWithSymmKey(user.otp);
  if (plainOTP === data.otp && user.isActive && isValidOTP(user.updatedAt)) {
    await updateOTP({id: user.id!, otp: user.otp, isActive: false});
    const nameHash = utils.keccak256(utils.toUtf8Bytes(user.id));
    const signature = await sign(nameHash, data.message);
    return {code: 200, signature};
  }

  return {code: 400, message: "Invalid OTP."};
});

const isValidOTP = (updatedAt: string) => {
  const time = new Date().getTime() - new Date(updatedAt).getTime();
  return time < expiredAfter;
};

const validateEmail = (email: string) => {
  return email && EmailValidator.is_email_valid(email);
};

const randomCode = (length: number) => {
  let code = "";
  const len = CHARS.length;
  for (let i = 0; i < length; i++ ) {
    code += CHARS[Math.floor(Math.random() * len)];
  }
  return code;
};
