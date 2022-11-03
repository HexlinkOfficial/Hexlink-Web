import {
    getAuth,
    getAdditionalUserInfo,
    GoogleAuthProvider,
    TwitterAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '@/services/firebase'
import { createUserIfNecessary, getUser } from '@/services/graphql/user'
import { useAuthStore } from "@/stores/auth"
import { accountAddress } from '@/services/web3/account'

const auth = getAuth(app)
const functions = getFunctions()

export async function getIdTokenAndSetClaimsIfNecessary(user: User) {
    let idToken = await user.getIdToken()
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
    return idToken
}

export async function googleSocialLogin() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider)
        const idToken = await getIdTokenAndSetClaimsIfNecessary(result.user)
        try {
            await createUserIfNecessary(result.user, idToken);
        } catch (error) {
            console.log("System log: Have trouble with login user")
            console.log(error)
            return
        }

        const store = useAuthStore();
        const walletAddress = await accountAddress(result.user.email);
        store.signIn(result.user, idToken, walletAddress);
    } catch (error: any) {
        if (error.code == 'auth/popup-closed-by-user') {
            return
        }
    }
}

export async function twitterSocialLogin() {
    const provider = new TwitterAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider)
        const idToken = await getIdTokenAndSetClaimsIfNecessary(result.user)
        try {
            await createUserIfNecessary(result.user, idToken);
        } catch (error) {
            console.log("System log: Have trouble with initializing user")
            console.log(error)
            return
        }
        const store = useAuthStore();
        const walletAddress = await accountAddress(result.user.providerId);
        store.signIn(result.user, idToken, walletAddress);
    } catch (error) {
        console.log(error);
    }
}

export function signOutFirebase() {
    return signOut(auth)
}