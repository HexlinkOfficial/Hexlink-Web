import {
    getAuth,
    GoogleAuthProvider,
    TwitterAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import type { IUser, Profile } from "@/types";
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '@/services/firebase'
import { useAuthStore } from "@/stores/auth"
import { useProfileStore } from "@/stores/profile"
import { useWalletStore } from "@/stores/wallet"
import { genNameHash, buildAccount } from '@/services/web3/account'
import { loadTokens } from "@/services/web3/tokens"

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
        const nameHash = genNameHash("mailto", result.user.email!);
        const account = await buildAccount(nameHash);
        const user : IUser = {
            provider: "google",
            uid: result.user.uid,
            providerUid: result.user.uid, // TODO: ensure this is google uid
            handle: result.user.email!,
            displayName: result.user.displayName || undefined,
            photoURL: result.user.photoURL || undefined,
            nameHash,
            idToken
        };
        useAuthStore().signIn(user);
        const store = useProfileStore();
        store.setProfile(store.network, await buildProfile(nameHash));
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
        const providerUid = result.user.providerData[0].uid;
        const nameHash = genNameHash("twitter.com", providerUid);
        const user : IUser = {
            provider: "twitter.com",
            uid: result.user.uid,
            providerUid,
            handle: result.user.reloadUserInfo.screenName,
            displayName: result.user.displayName || undefined,
            photoURL: result.user.photoURL || undefined,
            nameHash,
            idToken,
        };
        useAuthStore().signIn(user);
        const store = useProfileStore();
        store.setProfile(store.network, await buildProfile(nameHash));
        console.log(store.profile);
    } catch (error) {
        console.log(error);
    }
}

export function signOutFirebase() {
    useWalletStore().disconnectWallet();
    useProfileStore().clear();
    useAuthStore().signOut();
    return signOut(auth);
}

async function buildProfile(nameHash: string) : Promise<Profile> {
    const account = await buildAccount(nameHash);
    return {
        account,
        tokens: await loadTokens(account.address)
    }
}
