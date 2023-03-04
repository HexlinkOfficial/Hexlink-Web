import * as admin from "firebase-admin";

class PrivateFirebase {
  app : admin.app.App;
  db: admin.firestore.Firestore;
  storage: admin.storage.Storage;
  database: admin.database.Database;

  constructor() {
    try {
      admin.initializeApp();
    } catch (err) {
      console.log(err);
    }
    this.app = admin.app();
    this.db = admin.firestore();
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
