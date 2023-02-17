import { defineStore } from 'pinia';
import type { IAuth, IUser } from "@/types";

export const useAuthStore = defineStore({
    id: 'auth',
    state: (): IAuth => ({
        authenticated: false,
        user: undefined,
        returnUrl: undefined,
    }),
    persist: true,
    getters: {
        userInfo: (state) => ({
            handle: state.user!.handle,
            displayName: state.user!.displayName,
            provider: state.user!.provider,
            logoURI: state.user!.photoURL,
        })
    },
    actions: {
        signIn(user: IUser) {
            console.log("User logged in");
            this.user = user;
            this.authenticated = true;
        },
        refreshIdToken(idToken: string) {
            const oldUser = this.user!;
            this.user = {
                ...oldUser,
                idToken
            };
        },
        signOut() {
            this.authenticated = false;
            this.user = undefined;
            this.returnUrl = "/";
            console.log("User logged out");
        },
        setReturnUrl(returnUrl: string) {
            this.returnUrl = returnUrl;
        },
    },
});
