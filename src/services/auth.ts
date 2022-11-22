import {
    getAuth,
    GoogleAuthProvider,
    TwitterAuthProvider,
    GithubAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '@/services/firebase'
import { useAuthStore } from "@/stores/auth"
import { accountAddress } from '@/services/web3/account'

const auth = getAuth(app)
const functions = getFunctions()

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
        const idToken = await getIdTokenAndSetClaimsIfNecessary(result.user)
        const walletAddress = await accountAddress(result.user.email);
        const store = useAuthStore();
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
        const walletAddress = await accountAddress(result.user.providerId);
        const store = useAuthStore();
        store.signIn(result.user, idToken, walletAddress);
    } catch (error) {
        console.log(error);
    }
}

export async function githubSocialLogin() {
    const provider = new GithubAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider)
        const idToken = await getIdTokenAndSetClaimsIfNecessary(result.user)
        const walletAddress = await accountAddress(result.user.providerId);
        const store = useAuthStore();
        store.signIn(result.user, idToken, walletAddress);
    } catch (error) {
        console.log(error);
    }
}

export async function facebookSocialLogin() {
    const provider = new FacebookAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider)
        const idToken = await getIdTokenAndSetClaimsIfNecessary(result.user)
        const walletAddress = await accountAddress(result.user.providerId);
        const store = useAuthStore();
        store.signIn(result.user, idToken, walletAddress);
    } catch (error) {
        console.log(error);
    }
}

export function signOutFirebase() {
    return signOut(auth)
}