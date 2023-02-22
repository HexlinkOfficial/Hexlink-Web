import {Firebase} from "./firebase";
import * as admin from "firebase-admin";

const txServiceRateDBRef = "transaction/rates/";
const timestampKey = "timestamp";

export const rateLimiter = (callName: string, id: string, windowInSec: number, threshold: number) => {
  console.log("ratelimit - begin");
  const callRef = txServiceRateDBRef + callName;
  const db = Firebase.getInstance().database;
  const ref = db.ref(callRef);
  console.log(ref);

  const now = Date.now();
  console.log(now);
  ref.child(id).once("value", snapshot => {
    if (snapshot.exists()) {
      console.log("ratelimit - exist");
      const snapVal: string = snapshot.val();
      const tsMap: Map<string, number[]> = JSON.parse(snapVal);
      console.log("ratelimit - tsMap");
      console.log(tsMap);

      if (!tsMap.has(timestampKey)) {
        console.log("ratelimit - missing timestamp");
        addRecord(id, now, ref);
        return false;
      }

      const tsList: number[] = tsMap.get(timestampKey)!;
      console.log("ratelimit - tsList");
      console.log(tsList);

      const tsThre = now - 1000 * windowInSec;
      const tsInWindow = tsList.filter(ts => ts > tsThre);
      tsInWindow.push(now);
      console.log("ratelimit - pushed");
      console.log(tsInWindow);

      ref.update({[id]: JSON.stringify(tsInWindow)});
      console.log("ratelimit - ref updated");
      console.log(ref);

      return tsInWindow.length > threshold;
    } else {
      console.log("ratelimit - does not exist");
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
  console.log("ratelimit - ref added");
  console.log(ref);
}