import { defineStore } from 'pinia'
import type {  User } from 'firebase/auth'
import type { Connection } from "@/interfaces/connection";

export interface IUser {
  emailVerified: boolean,
  email: string | null,
  photoURL: string | null,
  uid: string,
  displayName: string | null,
  walletAddress: string | null,
  screenName: string | null,
  provider: string | null,
}

export interface OAccount {
  Oaccount: string | null,
  Onetwork: string | null,
  OchainId: number | null,
}

export interface IAuth {
  currentUser: IUser | null,
  idToken: string | null,
  returnUrl: string | null,
  Owallet: OAccount | null,
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): IAuth => ({
    idToken: null as string | null,
    currentUser: null as IUser | null,
    returnUrl: null as string | null,
    Owallet: null as OAccount | null,
  }),
  persist: true,
  getters: {
    authenticated: (state) => state.currentUser !== null && state.idToken != null,
  },
  actions: {
    connectOwallet(connection: Connection) {
      console.log("External account connected");
      this.Owallet = {
        Oaccount: connection.address!,
        Onetwork: connection.network!.name,
        OchainId: connection.network!.chainId,
      }
    },
    disconnectOwallet() {
      console.log("External account disconnected");
      this.Owallet = null;
    },
    signIn(user: User, idToken: string, walletAddress: string) {
      console.log("User logged in");
      this.idToken = idToken;
      this.currentUser = {
        emailVerified: user.emailVerified,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
        displayName: user.displayName,
        walletAddress: walletAddress.toLowerCase(),
        screenName: user.reloadUserInfo.screenName,
        provider: user.providerData[0].providerId,
      }
    },
    refreshIdToken(idToken: string) {
      this.idToken = idToken;
    },
    signOut() {
      console.log("User logged out");
      this.currentUser =  null;
      this.idToken = null;
    },
    setReturnUrl(returnUrl: string) {
      this.returnUrl = returnUrl;
    },
  },
})
