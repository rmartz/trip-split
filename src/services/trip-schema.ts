import { Timestamp } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

import type { Trip, TripMember } from "@/types";

export interface TripFirestore {
  createdAt: Timestamp;
  createdBy: string;
  description: string | null;
  name: string;
  updatedAt: Timestamp;
}

export interface TripMemberFirestore {
  addedBy: string;
  createdAt: Timestamp;
  name: string;
  userId: string | null;
}

export function tripToFirestore(
  trip: Omit<Trip, "id" | "createdAt" | "updatedAt">,
): Omit<TripFirestore, "createdAt" | "updatedAt"> {
  return {
    createdBy: trip.createdBy,
    description: trip.description ?? null,
    name: trip.name,
  };
}

export function firebaseToTrip(id: string, data: DocumentData): Trip {
  return {
    createdAt: (data.createdAt as Timestamp).toDate(),
    createdBy: data.createdBy as string,
    description: (data.description as string | null) ?? undefined,
    id,
    name: data.name as string,
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };
}

export function memberToFirestore(
  member: Omit<TripMember, "id" | "createdAt">,
): Omit<TripMemberFirestore, "createdAt"> {
  return {
    addedBy: member.addedBy,
    name: member.name,
    userId: member.userId ?? null,
  };
}

export function firebaseToMember(id: string, data: DocumentData): TripMember {
  return {
    addedBy: data.addedBy as string,
    createdAt: (data.createdAt as Timestamp).toDate(),
    id,
    name: data.name as string,
    userId: (data.userId as string | null) ?? undefined,
  };
}
