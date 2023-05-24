import * as EmailValidator from "node-email-validation";
import {Firebase} from "./firebase";
import * as functions from "firebase-functions";
import {getUser, insertUser, updateOTP} from "./graphql/user";
import {getAuth} from "firebase-admin/auth";
import {rateLimiter} from "./ratelimiter";
import {decryptWithSymmKey, encryptWithSymmKey, sign} from "./kms";
import formData from "form-data";
import Mailgun from "mailgun.js";
import {utils} from "ethers";

const secrets = functions.config().doppler || {};
const CHARS = "0123456789";
const OTP_LEN = 6;
const expiredAfter = 10 * 60000;

const sendEmail = async (otp: string, receipt: string) => {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: secrets.MAILGUN_API_KEY,
  });
  const data = {
    from: "Hexlink <no-reply@hexlink.io>",
    to: receipt,
    subject: "Hexlink Login Code",
    text: `Hi,\n\nThank you for choosing Hexlink. Use the following OTP to complete your Log in procedures. OTP is valid for 5 minute.\n${otp}\n\nRegards,\nHexlink`,
    html: `<html lang="en-US">

    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>New Account Email Template</title>
        <meta name="description" content="New Account Email Template.">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
        </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!-- 100% body table -->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <a href="play.hexlink.io" title="logo" target="_blank">
                                <img width="300" src="https://i.postimg.cc/HkJWJSNj/hexlink.png" title="logo" alt="logo">
                              </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px; background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Get started
                                            </h1>
                                            <p style="font-size:15px; color:#455056; margin:8px 0 0; line-height:24px;">
                                                Thank you for choosing Hexlink. Use the following verification code to complete your Log in procedures. 
                                                <br><strong>Code is valid for 5 minutes</strong>.</p>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p
                                                style="color:#455056; font-size:18px;line-height:20px; margin:0; font-weight: 500;">
                                                <strong
                                                    style="display: block;font-size: 13px; margin: 0 0 4px; color:rgba(0,0,0,.64); font-weight:normal;">Verification Code</strong>
                                                    <h2 style="font-size:2.5em; background: #1890ff;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>play.hexlink.io</strong> </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    </html>`,
  };
  await mg.messages.create("hexlink.io", data);
};

export const genOTP = functions.https.onCall(async (data, context) => {
  Firebase.getInstance();
  data.email = data.email.toLowerCase();
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

  await sendEmail(plainOTP, data.email);
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
    if (data.action == "genToken") {
      const customToken = await createCustomToken(user.id);
      return {code: 200, token: customToken};
    } else if (data.action == "sign") {
      const name = `mailto:${data.email}`;
      const nameHash = utils.keccak256(utils.toUtf8Bytes(name));
      const signature = await sign(nameHash, data.message);
      return {code: 200, signature};
    } else {
      throw new Error("invalid action");
    }
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
