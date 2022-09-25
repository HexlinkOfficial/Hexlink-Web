import {
    getAuth,
    getAdditionalUserInfo,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '@/services/firebase'
import { createInitialUser } from '@/services/graphql/user'

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

export async function socialLogin() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider)
        const { isNewUser } = getAdditionalUserInfo(result)!
        if (isNewUser) {
            const idToken = await getIdTokenAndSetClaimsIfNecessary(result.user)
            await createInitialUser(result.user, idToken)
        }
    } catch (error: any) {
        if (error.code == 'auth/popup-closed-by-user') {
            return
        }
    }
}

export function signOutFirebase() {
    return signOut(auth)
}