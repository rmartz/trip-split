import { get, push, ref, update } from "firebase/database";

import { getDb } from "@/lib/database";
import type { Trip } from "@/types";
import {
  firebaseToTrip,
  memberToFirebase,
  tripToFirebase,
} from "./trip-schema";

export async function createTrip(
  trip: Omit<Trip, "id" | "createdAt" | "updatedAt">,
  creatorName: string,
): Promise<Trip> {
  const db = getDb();
  const now = new Date().toISOString();

  const tripRef = push(ref(db, "trips"));
  const tripId = tripRef.key;

  const memberRef = push(ref(db, `members/${tripId}`));
  const memberId = memberRef.key;

  const updates: Record<string, unknown> = {
    [`trips/${tripId}`]: {
      ...tripToFirebase(trip),
      createdAt: now,
      updatedAt: now,
    },
    [`members/${tripId}/${memberId}`]: {
      ...memberToFirebase({
        addedBy: trip.createdBy,
        name: creatorName,
        userId: trip.createdBy,
      }),
      createdAt: now,
    },
    [`userTrips/${trip.createdBy}/${tripId}`]: true,
  };

  await update(ref(db), updates);

  const snapshot = await get(tripRef);
  const data = snapshot.val() as Record<string, unknown> | null;

  if (!data) {
    throw new Error("Failed to read trip after creation");
  }

  return firebaseToTrip(tripId, data);
}

export async function getTrip(tripId: string): Promise<Trip | undefined> {
  const db = getDb();
  const snapshot = await get(ref(db, `trips/${tripId}`));

  if (!snapshot.exists()) {
    return undefined;
  }

  return firebaseToTrip(tripId, snapshot.val() as Record<string, unknown>);
}

export async function getUserTrips(userId: string): Promise<Trip[]> {
  const db = getDb();

  const indexSnapshot = await get(ref(db, `userTrips/${userId}`));

  if (!indexSnapshot.exists()) {
    return [];
  }

  const tripIds = Object.keys(indexSnapshot.val() as Record<string, boolean>);

  const trips = await Promise.all(
    tripIds.map(async (tripId) => {
      const snapshot = await get(ref(db, `trips/${tripId}`));

      if (!snapshot.exists()) {
        return undefined;
      }

      return firebaseToTrip(tripId, snapshot.val() as Record<string, unknown>);
    }),
  );

  return trips.filter((t): t is Trip => t !== undefined);
}

export async function deleteTrip(tripId: string): Promise<void> {
  const db = getDb();

  const membersSnapshot = await get(ref(db, `members/${tripId}`));
  const updates: Record<string, null> = {
    [`expenses/${tripId}`]: null,
    [`members/${tripId}`]: null,
    [`trips/${tripId}`]: null,
  };

  if (membersSnapshot.exists()) {
    const members = membersSnapshot.val() as Record<
      string,
      Record<string, unknown>
    >;

    for (const memberData of Object.values(members)) {
      const userId = memberData.userId as string | null;

      if (userId) {
        updates[`userTrips/${userId}/${tripId}`] = null;
      }
    }
  }

  await update(ref(db), updates);
}

export async function updateTrip(
  tripId: string,
  updates: Partial<Pick<Trip, "description" | "name">>,
): Promise<void> {
  const db = getDb();
  const firebaseUpdates: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (updates.name !== undefined) {
    firebaseUpdates.name = updates.name;
  }

  if ("description" in updates) {
    firebaseUpdates.description = updates.description ?? null;
  }

  await update(ref(db, `trips/${tripId}`), firebaseUpdates);
}
