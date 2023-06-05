import {
    getAuth,
    GoogleAuthProvider,
    TwitterAuthProvider,
    signInAnonymously,
    signInWithPopup,
    signOut,
} from '@firebase/auth';
import type { IUser } from "@/types";
import { getFunctions, httpsCallable } from '@firebase/functions';
import { app } from '@/services/firebase';
import { useAuthStore } from "@/stores/auth";
import { switchNetwork } from "@/web3/network";
import { GOERLI, SUPPORTED_CHAINS, type Chain } from "../../../../functions/common";
import { useChainStore } from '@/stores/chain';
import { initTokenList } from "@/web3/tokens";
import { useTokenStore } from '@/stores/token';
import { normalizeEmail, createNotification } from "@/web3/utils";

import type { Token } from "../../../../functions/common";
import type { PhoneData } from "../types";

const auth = getAuth(app)
const functions = getFunctions()

export async function genAndSendOtp() {
    const user = useAuthStore().user!;
    const genOtpCall = httpsCallable(functions, 'genAndSendOTP');
    const result = await genOtpCall({
        receiver: {schema: user.idType, value: user.handle}
    });
    return (result.data as any).code as number;
}

export async function genSignature(otp: string, message: string) {
    const user = useAuthStore().user!;
    if (user.idType != "mailto" && user.idType != "tel") {
        throw new Error("supported identity type");
    }
    const validateOTPCall = httpsCallable(functions, 'validateOtp');
    const inputParam : any = {
        receiver: {schema: user.idType, value: user.handle},
        otp,
        message
    };
    const result = await validateOTPCall(inputParam);
    return result.data;
}

export async function notifyTransfer(
    receiver: {schema: string, value: string},
    sendAmount: string,
    token: Token
) {
    try {
        const sender = useAuthStore().user!;
        const notifyTransferCall = httpsCallable(functions, 'notifyTransfer');
        await notifyTransferCall({
            sender: {schema: sender.idType, value: sender.handle},
            receiver,
            sendAmount,
            token
        });
    } catch(err) {
        console.log(err);
        createNotification("Faied to send the notification email.", "warning")
    }
}

export async function refreshToken() {
    const idToken = await auth.currentUser!.getIdToken(true);
    const store = useAuthStore();
    store.refreshIdToken(idToken);
}

export async function phoneNumberAnonymousLogin(pd: PhoneData) {
    try {
        const result = await signInAnonymously(auth);
        const idToken = await result.user!.getIdToken();
        const user : IUser = {
            provider: "hexlink.io",
            idType: "tel",
            email: "",
            handle: pd.number!,
            name: pd.uri!,
            uid: result.user.uid,
            providerUid: result.user.uid, // TODO: ensure this is google uid
            displayName: result.user.displayName || undefined,
            photoURL: result.user.photoURL || undefined,
            idToken
        };
        useAuthStore().signIn(user);
        await init();
    } catch(error: any) {
        console.log(error);
        createNotification(error.message, "error");
    }
}

export async function emailAnonymousLogin(email: string) {
    try {
        email = normalizeEmail(email);
        const result = await signInAnonymously(auth);
        const idToken = await result.user!.getIdToken();
        const user : IUser = {
            provider: "hexlink.io",
            idType: "mailto",
            email: email,
            handle: email,
            name: `mailto:${email}`,
            uid: result.user.uid,
            providerUid: result.user.uid, // TODO: ensure this is google uid
            displayName: result.user.displayName || undefined,
            photoURL: result.user.photoURL || undefined,
            idToken
        };
        useAuthStore().signIn(user);
        await init();
    } catch(error: any) {
        console.log(error);
        createNotification(error.message, "error");
    }
}

export async function googleSocialLogin() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider)
        const idToken = await result.user!.getIdToken();
        const email = result.user.email!.toLowerCase();
        const user : IUser = {
            provider: "google.com",
            idType: "mailto",
            email: email,
            handle: email,
            name: `mailto:${email}`,
            uid: result.user.uid,
            providerUid: result.user.uid, // TODO: ensure this is google uid
            displayName: result.user.displayName || undefined,
            photoURL: result.user.photoURL || undefined,
            idToken
        };
        useAuthStore().signIn(user);
        await init();
    } catch (error: any) {
        if (error.code == 'auth/popup-closed-by-user') {
            return
        } else {
            createNotification(error.message, "error");
        }
    }
}

export async function twitterSocialLogin() {
    const provider = new TwitterAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user!.getIdToken();
        const handle = result.user.reloadUserInfo.screenName;
        const user : IUser = {
            provider: "twitter.com",
            idType: "twitter.com",
            name: `https://twitter.com/${handle}`,
            handle: `@${handle}`,
            uid: result.user.uid,
            providerUid: result.user.providerData[0].uid,
            displayName: result.user.displayName || undefined,
            photoURL: result.user.photoURL || undefined,
            idToken,
        };
        useAuthStore().signIn(user);
        await init();
    } catch (error: any) {
        console.log(error);
        createNotification(error.message, "error");
    }
}

export function signOutFirebase() {
    useAuthStore().signOut();
    useTokenStore().reset();
    useChainStore().reset();
    return signOut(auth);
}

export async function init() {
    await Promise.all(
        SUPPORTED_CHAINS.map((chain: Chain) => initTokenList(chain))
    );
    await switchNetwork(GOERLI);
}