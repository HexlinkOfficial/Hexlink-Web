import {Firebase} from "./firebase";
import * as admin from "firebase-admin";

const txServiceRateDBRef = "transaction/rates/";
const timestampKey = "timestamp";

export const rateLimiter = (callName: string, id: string, windowInSec: number, threshold: number) => {
  const callRef = txServiceRateDBRef + callName;
  const db = Firebase.getInstance().database;
  const ref = db.ref(callRef);

  const now = Date.now();
  ref.child(id).once("value", snapshot => {
    if (snapshot.exists()) {
      const snapVal: string = snapshot.val();
      const tsMap: Map<string, number[]> = JSON.parse(snapVal);

      if (!tsMap.has(timestampKey)) {
        addRecord(id, now, ref);
        return false;
      }

      const tsList: number[] = tsMap.get(timestampKey)!;
      const tsThre = now - 1000 * windowInSec;
      const tsInWindow = tsList.filter(ts => ts > tsThre);
      tsInWindow.push(now);
      ref.update({[id]: JSON.stringify(tsInWindow)});

      return tsInWindow.length > threshold;
    } else {
      addRecord(id, now, ref);
      return false;
    }
  });
}

const addRecord = (id: string, now: number, ref: admin.database.Reference) => {
  const timestampMap = new Map<string, number[]>([
    [timestampKey, [now]]
  ]);
  ref.update({[id]: JSON.stringify(timestampMap)});
}