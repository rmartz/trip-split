import { get, push, ref, remove, set } from "firebase/database";

import { getDb } from "@/lib/database";
import type { TripMember } from "@/types";
import { firebaseToMember, memberToFirebase } from "./trip-schema";

export async function addMember(
  tripId: string,
  member: Omit<TripMember, "id" | "createdAt">,
): Promise<TripMember> {
  const db = getDb();
  const memberRef = push(ref(db, `members/${tripId}`));

  const data = {
    ...memberToFirebase(member),
    createdAt: new Date().toISOString(),
  };

  await set(memberRef, data);

  return firebaseToMember(memberRef.key, data);
}

export async function getMembers(tripId: string): Promise<TripMember[]> {
  const db = getDb();
  const snapshot = await get(ref(db, `members/${tripId}`));

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val() as Record<string, Record<string, unknown>>;

  return Object.entries(data).map(([id, memberData]) =>
    firebaseToMember(id, memberData),
  );
}

export async function removeMember(
  tripId: string,
  memberId: string,
): Promise<void> {
  const db = getDb();
  await remove(ref(db, `members/${tripId}/${memberId}`));
}
