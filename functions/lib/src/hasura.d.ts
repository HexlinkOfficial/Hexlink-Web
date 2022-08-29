import * as functions from "firebase-functions";
export declare const processSignUp: functions.CloudFunction<import("firebase-admin/auth").UserRecord>;
export declare const refreshToken: functions.HttpsFunction & functions.Runnable<any>;
