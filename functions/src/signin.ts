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
  buildNotifyTransferSmsMessage,
} from "./notification";
import {parsePhoneNumber, isValidPhoneNumber} from "libphonenumber-js";
import {Twilio} from "twilio";

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

function genUserId(user: {schema: string, value: string}) : string {
  let userId: string;
  if (user.schema === "mailto") {
    const email = user.value.toLowerCase();
    if (!validateEmail(email)) {
      throw new Error("invalid_email");
    }
    userId = `mailto:${email}`;
  } else if (user.schema === "tel") {
    if (!isValidPhoneNumber(user.value)) {
      throw new Error("invalid_phone_number");
    }
    const phoneNumber = parsePhoneNumber(user.value);
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

const sendSms = async (receiver: string, data: string) => {
  const twilioClient = new Twilio(
      secrets.TWILIO_ACCOUNT_SID,
      secrets.TWILIO_AUTH_TOKEN
  );
  await twilioClient.messages.create({
    messagingServiceSid: secrets.TWILIO_MG_SERVICE_SID,
    body: data,
    to: receiver,
  });
};

const sendSmsOtp = async (receiver: string) => {
  const twilioClient = new Twilio(
      secrets.TWILIO_ACCOUNT_SID,
      secrets.TWILIO_AUTH_TOKEN
  );
  await twilioClient.verify.v2.services(
      secrets.TWILIO_VA_SERVICE_SID
  ).verifications.create({to: receiver, channel: "sms"});
};

const checkSmsOtp = async (receiver: string, otp: string) => {
  const twilioClient = new Twilio(
      secrets.TWILIO_ACCOUNT_SID,
      secrets.TWILIO_AUTH_TOKEN
  );
  try {
    const check = await twilioClient.verify.v2.services(
        secrets.TWILIO_VA_SERVICE_SID
    ).verificationChecks.create({to: receiver, code: otp});
    return check.status === "approved";
  } catch (_err: any) {
    // resource not found error
    return false;
  }
};

export const notifyTransfer = functions.https.onCall(async (data, context) => {
  Firebase.getInstance();
  try {
    const userId = genUserId(data.sender);
    await sendOtpRateLimit(3, context);
    const user = await getUserById(userId);
    if (!user || !user.id) {
      return {code: 400, message: "user not exists"};
    }

    if (data.receiver.schema === "mailto") {
      await sendEmail(getNewTransferNotification(
          data.sender.value,
          data.receiver.value,
          data.token,
          data.sendAmount,
      ));
    } else if (data.receiver.schema === "tel") {
      await sendSms(
          data.receiver.value,
          buildNotifyTransferSmsMessage(
              data.sender.value,
              data.token,
              data.sendAmount
          )
      );
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
    const userId = genUserId(data.receiver);
    await sendOtpRateLimit(3, context);

    if (data.receiver.schema === "mailto") {
      const plainOTP = randomCode(OTP_LEN);
      const encryptedOTP = await encryptWithSymmKey(plainOTP);
      const user = await getUserById(userId);
      if (!user) {
        await insertUser([{id: userId, otp: encryptedOTP}]);
      } else {
        await updateOTP({id: userId, otp: encryptedOTP, isActive: true});
      }
      await sendEmail(
          getAuthenticationNotification(data.receiver.value, plainOTP)
      );
    } else if (data.receiver.schema === "tel") {
      await sendSmsOtp(data.receiver.value);
    }
    return {code: 200, sentAt: new Date().getTime()};
  } catch (e: any) {
    console.log(e);
    const code = e.message === "rate_limited" ? 429 : 400;
    return {code, message: e.message};
  }
});

export const validateOtp = functions.https.onCall(async (data) => {
  Firebase.getInstance();
  const userId = genUserId(data.receiver);
  if (!data.otp) {
    return {code: 400, message: "Email or OTP is missing."};
  }
  const isQuotaExceeded = await rateLimiter(
      "validate_otp", userId, 300, 10
  );
  if (isQuotaExceeded) {
    return {code: 429, message: "too many requests"};
  }

  if (data.receiver.schema === "mailto") {
    const user = await getUserById(userId);
    if (!user) {
      return {code: 400, message: "No record for the userId, " + userId};
    }
    const plainOTP = <string> await decryptWithSymmKey(user.otp);
    if (plainOTP === data.otp && user.isActive && isValidOTP(user.updatedAt!)) {
      await updateOTP({id: user.id!, otp: user.otp, isActive: false});
      return signMessage(user.id, data.message);
    }
  } else if (data.receiver.schema === "tel") {
    if (await checkSmsOtp(data.receiver.value, data.otp)) {
      return signMessage(userId, data.message);
    }
  }
  return {code: 400, message: "failed to validate otp"};
});

const signMessage = async (userId: string, message: string) => {
  const nameHash = utils.keccak256(utils.toUtf8Bytes(userId));
  const signature = await sign(nameHash, message);
  return {code: 200, signature};
};

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

