import { defineStore } from 'pinia';
import type { IAuth, IUser } from "@/types";

export const useAuthStore = defineStore({
    id: 'auth',
    state: (): IAuth => ({
        authenticated: false,
        user: undefined,
        idToken: undefined,
        returnUrl: undefined,
    }),
    persist: true,
    actions: {
        signIn(user: IUser, idToken: string) {
            console.log("User logged in");
            this.idToken = idToken;
            this.user = user,
            this.authenticated = true;
        },
        refreshIdToken(idToken: string) {
            this.idToken = idToken;
        },
        signOut() {
            this.authenticated = false;
            this.user = undefined;
            this.idToken = undefined;
            console.log("User logged out");
        },
        setReturnUrl(returnUrl: string) {
            this.returnUrl = returnUrl;
        },
    },
})
