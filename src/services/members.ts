import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { getDb } from "@/lib/firestore";
import type { TripMember } from "@/types";
import { firebaseToMember, memberToFirestore } from "./trip-schema";

export async function addMember(
  tripId: string,
  member: Omit<TripMember, "id" | "createdAt">,
): Promise<TripMember> {
  const db = getDb();
  const docRef = await addDoc(collection(db, "trips", tripId, "members"), {
    ...memberToFirestore(member),
    createdAt: serverTimestamp(),
  });

  return {
    ...member,
    createdAt: new Date(),
    id: docRef.id,
  };
}

export async function getMembers(tripId: string): Promise<TripMember[]> {
  const db = getDb();
  const snapshot = await getDocs(collection(db, "trips", tripId, "members"));

  return snapshot.docs.map((d) => firebaseToMember(d.id, d.data()));
}

export async function removeMember(
  tripId: string,
  memberId: string,
): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "trips", tripId, "members", memberId));
}
