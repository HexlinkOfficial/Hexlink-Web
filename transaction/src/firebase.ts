/* tslint:disable:max-classes-per-file */
import * as admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIAL_JSON!);
class PrivateFirebase {
  app: admin.app.App;
  auth: admin.auth.Auth;
  storage: admin.storage.Storage;

  constructor() {
    this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    this.storage = admin.storage();
    this.auth = admin.auth();
  }
}

/* tslint:disable:max-classes-per-file */

export class Firebase {
  private static instance : PrivateFirebase;

  private constructor() {
    throw new Error("Use Firebase.getInstance()");
  }

  static getInstance() {
    if (!Firebase.instance) {
      Firebase.instance = new PrivateFirebase();
    }
    return Firebase.instance;
  }
}
