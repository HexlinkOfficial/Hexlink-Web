import {
    getAuth,
    GoogleAuthProvider,
    TwitterAuthProvider,
    signInWithCustomToken,
    signInWithPopup,
    signOut,
} from '@firebase/auth';
import type { User } from '@firebase/auth';
import type { IUser } from "@/types";
import { getFunctions, httpsCallable,  type HttpsCallable } from '@firebase/functions';
import { app } from '@/services/firebase';
import { useAuthStore } from "@/stores/auth";
import { switchNetwork } from "@/web3/network";
import { GOERLI, SUPPORTED_CHAINS, type Chain } from "../../../../functions/common";
import { useChainStore } from '@/stores/chain';
import { initTokenList } from "@/web3/tokens";
import { useTokenStore } from '@/stores/token';
import * as jose from 'jose'
import { ethers } from "ethers";

import type {Provider} from "@ethersproject/providers";
import { Hexlink__factory } from '@hexlink/contracts';
import { hexlContract } from "../../../../functions/common/src/hexlink"

const auth = getAuth(app)
const functions = getFunctions()
const hexlinkInterface = Hexlink__factory.createInterface();

export async function genOTP(email: string) {
    const genOTPCall = httpsCallable(functions, 'genOTP');
    const result = await genOTPCall({email: email});
    return (result.data as any).code as number;
}

export async function validateOTP(email: string, otp: string) {
    const validateOTPCall = httpsCallable(functions, 'validateOTP');
    const result = await validateOTPCall({email, otp, action: "genToken"});
    const resultData = result.data as any;
    if (resultData.code !== 200) {
        return {code: resultData.code, message: resultData.message}
    }

    try {
        const userCredential = await signInWithCustomToken(auth, resultData.token);
        const cred = userCredential.user;
        const idToken = await getIdTokenAndSetClaimsIfNecessary(cred);
        email = email.toLowerCase();
        const user : IUser = {
            provider: "email",
            idType: "mailto",
            email,
            handle: email,
            name: `mailto:${email}`,
            uid: cred.uid,
            providerUid: email,
            displayName: "Anonymous",
            idToken,
        };
        useAuthStore().signIn(user);
        await init();
        return {code: 200};
    } catch (error) {
        console.log(error);
    }
}

export async function getIdTokenAndSetClaimsIfNecessary(user: User, refresh: boolean = false) {
    let idToken = await user.getIdToken(refresh)
    const idTokenResult = await user.getIdTokenResult()
    if (!idTokenResult.claims['https://hasura.io/jwt/claims']) {
        const refreshToken = httpsCallable(functions, 'refreshToken')
        try {
            await refreshToken()
            idToken = await user.getIdToken(true)
        } catch (error: any) {
            console.error(
                "Unable to refresh token, which doesn't have Hasura claim.",
            )
            signOutFirebase()
            throw(error)
        }
    }
    if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
        const secret = new TextEncoder().encode(
            "DkMEqQV1ZtLnTCGQOdtce5TfhpHY74ob"
        );
        return await new jose.SignJWT(jose.decodeJwt(idToken))
            .setProtectedHeader({ alg: "HS256" })
            .sign(secret);
    }
    return idToken
}

export async function refreshToken() {
    const idToken = await getIdTokenAndSetClaimsIfNecessary(auth.currentUser!, true);
    const store = useAuthStore();
    store.refreshIdToken(idToken);
}

export async function googleSocialLogin() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider)
        const idToken = await getIdTokenAndSetClaimsIfNecessary(result.user);
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
        }
    }
}

export async function twitterSocialLogin() {
    const provider = new TwitterAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const idToken = await getIdTokenAndSetClaimsIfNecessary(result.user);
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
    } catch (error) {
        console.log(error);
    }
}

export function signOutFirebase() {
    useAuthStore().signOut();
    useTokenStore().reset();
    useChainStore().reset();
    return signOut(auth);
}

export async function genSignature(otp: string, message: string) {
    const user = useAuthStore().user!;
    if (user.idType != "mailto") {
        throw new Error("supported identity type");
    }
    const validateOTPCall = httpsCallable(functions, 'validateOTP');
    const inputParam : any = {email: user.email!, otp, action: "sign", message};
    const result = await validateOTPCall(inputParam);
    return result.data;
}

export async function init() {
    await Promise.all(
        SUPPORTED_CHAINS.map((chain: Chain) => initTokenList(chain))
    );
    await switchNetwork(GOERLI);
}