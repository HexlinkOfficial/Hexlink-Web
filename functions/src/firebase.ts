import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

class PrivateFirebase {
  app : admin.app.App;
  db: admin.firestore.Firestore;
  storage: admin.storage.Storage;
  database: admin.database.Database;

  constructor() {
    const secrets = functions.config().doppler || {};
    this.app = admin.initializeApp({
      projectId: secrets.VITE_FIREBASE_PROJECT_ID,
      databaseURL: "https://bridge23-27764-default-rtdb.firebaseio.com",
    });
    this.db = admin.firestore();
    this.db.settings({ignoreUndefinedProperties: true});
    this.storage = admin.storage();
    this.database = admin.database();
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
