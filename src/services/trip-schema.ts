import type { Trip, TripMember } from "@/types";

export interface TripFirebase {
  createdAt: string;
  createdBy: string;
  description: string | null;
  name: string;
  updatedAt: string;
}

export interface TripMemberFirebase {
  addedBy: string;
  createdAt: string;
  name: string;
  userId: string | null;
}

export function tripToFirebase(
  trip: Omit<Trip, "id" | "createdAt" | "updatedAt">,
): Omit<TripFirebase, "createdAt" | "updatedAt"> {
  return {
    createdBy: trip.createdBy,
    description: trip.description ?? null,
    name: trip.name,
  };
}

export function firebaseToTrip(
  id: string,
  data: Record<string, unknown>,
): Trip {
  return {
    createdAt: new Date(data.createdAt as string),
    createdBy: data.createdBy as string,
    description: (data.description as string | null) ?? undefined,
    id,
    name: data.name as string,
    updatedAt: new Date(data.updatedAt as string),
  };
}

export function memberToFirebase(
  member: Omit<TripMember, "id" | "createdAt">,
): Omit<TripMemberFirebase, "createdAt"> {
  return {
    addedBy: member.addedBy,
    name: member.name,
    userId: member.userId ?? null,
  };
}

export function firebaseToMember(
  id: string,
  data: Record<string, unknown>,
): TripMember {
  return {
    addedBy: data.addedBy as string,
    createdAt: new Date(data.createdAt as string),
    id,
    name: data.name as string,
    userId: (data.userId as string | null) ?? undefined,
  };
}
