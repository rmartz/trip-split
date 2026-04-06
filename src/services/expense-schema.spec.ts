import { describe, expect, it } from "vitest";

import { expenseToFirebase, firebaseToExpense } from "./expense-schema";

describe("expenseToFirebase", () => {
  it("converts an expense to Firebase format", () => {
    expect(
      expenseToFirebase({
        createdBy: "user-1",
        currency: "USD",
        description: "Dinner",
        paidByMemberId: "member-1",
        splitAmong: ["member-1", "member-2"],
        splitType: "equal",
        totalAmountCents: 5000,
      }),
    ).toEqual({
      createdBy: "user-1",
      currency: "USD",
      description: "Dinner",
      paidByMemberId: "member-1",
      splitAmong: ["member-1", "member-2"],
      splitType: "equal",
      totalAmountCents: 5000,
    });
  });
});

describe("firebaseToExpense", () => {
  it("converts Firebase data to an Expense", () => {
    const result = firebaseToExpense("expense-1", {
      createdAt: "2026-03-15T10:00:00.000Z",
      createdBy: "user-1",
      currency: "USD",
      description: "Dinner",
      paidByMemberId: "member-1",
      splitAmong: ["member-1", "member-2"],
      splitType: "equal",
      totalAmountCents: 5000,
      updatedAt: "2026-03-15T12:00:00.000Z",
    });

    expect(result).toEqual({
      createdAt: new Date("2026-03-15T10:00:00.000Z"),
      createdBy: "user-1",
      currency: "USD",
      description: "Dinner",
      id: "expense-1",
      paidByMemberId: "member-1",
      splitAmong: ["member-1", "member-2"],
      splitType: "equal",
      totalAmountCents: 5000,
      updatedAt: new Date("2026-03-15T12:00:00.000Z"),
    });
  });
});
