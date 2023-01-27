import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

class PrivateFirebase {
  app : admin.app.App;
  db: admin.firestore.Firestore;
  storage: admin.storage.Storage;

  constructor() {
    const secrets = functions.config().doppler || {};
    const credential = secrets.GOOGLE_CREDENTIAL_JSON;
    let params;
    if (credential) {
      const serviceAccount = JSON.parse(credential);
      params = {
        credential: admin.credential.cert(serviceAccount),
      };
    } else {
      params = functions.config().firebase;
    }

    this.app = admin.initializeApp(params);
    this.db = admin.firestore();
    this.db.settings({ignoreUndefinedProperties: true});
    this.storage = admin.storage();
  }
}

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
