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
            console.log("User logged out");
        },
        setReturnUrl(returnUrl: string) {
            this.returnUrl = returnUrl;
        },
    },
});
