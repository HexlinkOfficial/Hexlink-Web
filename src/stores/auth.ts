import { defineStore } from 'pinia'
import { getAuth } from 'firebase/auth'
import { app } from '@/services/firebase'
import { getIdTokenAndSetClaimsIfNecessary } from '@/services/auth'
import { getUser } from '@/services/user'
import { clearApolloClient } from '@/services/apolloClient'

export interface IUser {
  emailVerified: boolean,
  email: string
  photoURL: string
  uid: string
  displayName: string
}

export interface IAuth {
  currentUser: IUser | null,
  idToken: string | null,
  returnUrl: string | null;
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): IAuth => ({
    idToken: null as string | null,
    currentUser: null as IUser | null,
    returnUrl: null as string | null,
  }),
  getters: {
    authenticated: (state) => state.currentUser !== null && state.idToken != null,
  },
  actions: {
    initializeAuthListener() {
      return new Promise((resolve) => {
        getAuth(app).onAuthStateChanged(async (user: any) => {
          if (user) {
            console.log("User logged in");
            this.idToken = await getIdTokenAndSetClaimsIfNecessary(user);
            this.currentUser = {
              emailVerified: user.emailVerified,
              email: user.email,
              photoURL: user.photoURL,
              uid: user.uid,
              displayName: user.displayName
            }
          } else {
            console.log("User logged out");
            this.currentUser =  null;
            this.idToken = null;
            clearApolloClient();
          }
          await getUser(user, this.idToken!);
          resolve(true);
        });
      });
    },
    setReturnUrl(returnUrl: string) {
      this.returnUrl = returnUrl;
    },
  }
})
