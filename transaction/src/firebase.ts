/* tslint:disable:max-classes-per-file */
import * as admin from "firebase-admin";

// const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIAL_JSON!);
class PrivateFirebase {
  app: admin.app.App;
  auth: admin.auth.Auth;
  storage: admin.storage.Storage;
  database: admin.database.Database;

  constructor() {
    this.app = admin.initializeApp({
        // credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://bridge23-27764-default-rtdb.firebaseio.com"
    });
    this.storage = admin.storage();
    this.auth = admin.auth();
    this.database = admin.database();
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
