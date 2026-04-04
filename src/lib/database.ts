import { getDatabase } from "firebase/database";

import { getFirebaseApp } from "./firebase";

export function getDb() {
  return getDatabase(getFirebaseApp());
}
