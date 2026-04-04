import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { getDb } from "@/lib/firestore";
import type { Trip } from "@/types";
import { firebaseToTrip, tripToFirestore } from "./trip-schema";
import { memberToFirestore } from "./trip-schema";

export async function createTrip(
  trip: Omit<Trip, "id" | "createdAt" | "updatedAt">,
  creatorName: string,
): Promise<Trip> {
  const db = getDb();
  const batch = writeBatch(db);

  const tripRef = doc(collection(db, "trips"));
  batch.set(tripRef, {
    ...tripToFirestore(trip),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const memberRef = doc(collection(db, "trips", tripRef.id, "members"));
  batch.set(memberRef, {
    ...memberToFirestore({
      addedBy: trip.createdBy,
      name: creatorName,
      userId: trip.createdBy,
    }),
    createdAt: serverTimestamp(),
  });

  await batch.commit();

  const snapshot = await getDoc(tripRef);
  const data = snapshot.data();

  if (!data) {
    throw new Error("Failed to read trip after creation");
  }

  return firebaseToTrip(tripRef.id, data);
}

export async function getTrip(tripId: string): Promise<Trip | undefined> {
  const db = getDb();
  const snapshot = await getDoc(doc(db, "trips", tripId));

  if (!snapshot.exists()) {
    return undefined;
  }

  return firebaseToTrip(snapshot.id, snapshot.data());
}

// TODO: queries by createdBy only -- will need to change to a membership-based
// query (collection group on members subcollection or denormalized memberUserIds
// array) once users can join trips they didn't create (#10).
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
  const firestoreUpdates: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (updates.name !== undefined) {
    firestoreUpdates.name = updates.name;
  }

  if ("description" in updates) {
    firestoreUpdates.description = updates.description ?? null;
  }

  await updateDoc(doc(db, "trips", tripId), firestoreUpdates);
}
