import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { getDb } from "@/lib/firestore";
import type { Trip } from "@/types";
import { firebaseToTrip, tripToFirestore } from "./trip-schema";
import { addMember } from "./members";

export async function createTrip(
  trip: Omit<Trip, "id" | "createdAt" | "updatedAt">,
  creatorName: string,
): Promise<Trip> {
  const db = getDb();
  const docRef = await addDoc(collection(db, "trips"), {
    ...tripToFirestore(trip),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const snapshot = await getDoc(docRef);
  const data = snapshot.data();

  if (!data) {
    throw new Error("Failed to read trip after creation");
  }

  await addMember(docRef.id, {
    addedBy: trip.createdBy,
    name: creatorName,
    userId: trip.createdBy,
  });

  return firebaseToTrip(docRef.id, data);
}

export async function getTrip(tripId: string): Promise<Trip | undefined> {
  const db = getDb();
  const snapshot = await getDoc(doc(db, "trips", tripId));

  if (!snapshot.exists()) {
    return undefined;
  }

  return firebaseToTrip(snapshot.id, snapshot.data());
}

export async function getUserTrips(userId: string): Promise<Trip[]> {
  const db = getDb();
  const q = query(collection(db, "trips"), where("createdBy", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => firebaseToTrip(d.id, d.data()));
}

export async function updateTrip(
  tripId: string,
  updates: Partial<Pick<Trip, "description" | "name">>,
): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, "trips", tripId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}
