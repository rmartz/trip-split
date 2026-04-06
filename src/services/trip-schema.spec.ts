import { describe, expect, it } from "vitest";

import {
  firebaseToMember,
  firebaseToTrip,
  memberToFirebase,
  tripToFirebase,
} from "./trip-schema";

describe("tripToFirebase", () => {
  it("converts a trip to Firebase format", () => {
    expect(
      tripToFirebase({
        createdBy: "user-1",
        description: "A fun trip",
        name: "Beach Trip",
      }),
    ).toEqual({
      createdBy: "user-1",
      description: "A fun trip",
      name: "Beach Trip",
    });
  });

  it("converts undefined description to null", () => {
    expect(
      tripToFirebase({
        createdBy: "user-1",
        name: "Beach Trip",
      }),
    ).toEqual({
      createdBy: "user-1",
      description: null,
      name: "Beach Trip",
    });
  });
});

describe("firebaseToTrip", () => {
  it("converts Firebase data to a Trip", () => {
    const result = firebaseToTrip("trip-1", {
      createdAt: "2026-03-15T10:00:00.000Z",
      createdBy: "user-1",
      description: "A fun trip",
      name: "Beach Trip",
      updatedAt: "2026-03-15T12:00:00.000Z",
    });

    expect(result).toEqual({
      createdAt: new Date("2026-03-15T10:00:00.000Z"),
      createdBy: "user-1",
      description: "A fun trip",
      id: "trip-1",
      name: "Beach Trip",
      updatedAt: new Date("2026-03-15T12:00:00.000Z"),
    });
  });

  it("converts null description to undefined", () => {
    const result = firebaseToTrip("trip-1", {
      createdAt: "2026-03-15T10:00:00.000Z",
      createdBy: "user-1",
      description: null,
      name: "Beach Trip",
      updatedAt: "2026-03-15T10:00:00.000Z",
    });

    expect(result.description).toBeUndefined();
  });
});

describe("memberToFirebase", () => {
  it("converts a member to Firebase format", () => {
    expect(
      memberToFirebase({
        addedBy: "user-1",
        name: "Alice",
        userId: "user-2",
      }),
    ).toEqual({
      addedBy: "user-1",
      name: "Alice",
      userId: "user-2",
    });
  });

  it("converts undefined userId to null", () => {
    expect(
      memberToFirebase({
        addedBy: "user-1",
        name: "Alice",
      }),
    ).toEqual({
      addedBy: "user-1",
      name: "Alice",
      userId: null,
    });
  });
});

describe("firebaseToMember", () => {
  it("converts Firebase data to a TripMember", () => {
    const result = firebaseToMember("member-1", {
      addedBy: "user-1",
      createdAt: "2026-03-15T10:00:00.000Z",
      name: "Alice",
      userId: "user-2",
    });

    expect(result).toEqual({
      addedBy: "user-1",
      createdAt: new Date("2026-03-15T10:00:00.000Z"),
      id: "member-1",
      name: "Alice",
      userId: "user-2",
    });
  });

  it("converts null userId to undefined", () => {
    const result = firebaseToMember("member-1", {
      addedBy: "user-1",
      createdAt: "2026-03-15T10:00:00.000Z",
      name: "Alice",
      userId: null,
    });

    expect(result.userId).toBeUndefined();
  });
});
