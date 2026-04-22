import { describe, expect, it } from "vitest";

import { SplitType } from "@/types";

import { expenseToFirebase, firebaseToExpense } from "./expense-schema";

describe("expenseToFirebase", () => {
  it("converts an equal-split expense to Firebase format", () => {
    expect(
      expenseToFirebase({
        createdBy: "user-1",
        currency: "USD",
        description: "Dinner",
        paidByMemberId: "member-1",
        splitAmong: ["member-1", "member-2"],
        splitType: SplitType.Equal,
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

  it("converts an itemized expense to Firebase format including items, tax, and tip", () => {
    expect(
      expenseToFirebase({
        createdBy: "user-1",
        currency: "USD",
        description: "Dinner",
        items: [
          { amountCents: 1200, assignedTo: ["member-1"], description: "Salad" },
        ],
        paidByMemberId: "member-1",
        splitAmong: ["member-1", "member-2"],
        splitType: SplitType.Itemized,
        taxCents: 150,
        tipCents: 200,
        totalAmountCents: 1550,
      }),
    ).toEqual({
      createdBy: "user-1",
      currency: "USD",
      description: "Dinner",
      items: [
        { amountCents: 1200, assignedTo: ["member-1"], description: "Salad" },
      ],
      paidByMemberId: "member-1",
      splitAmong: ["member-1", "member-2"],
      splitType: "itemized",
      taxCents: 150,
      tipCents: 200,
      totalAmountCents: 1550,
    });
  });

  it("omits items, tax, and tip for equal-split expenses", () => {
    const result = expenseToFirebase({
      createdBy: "user-1",
      currency: "USD",
      description: "Dinner",
      paidByMemberId: "member-1",
      splitAmong: ["member-1"],
      splitType: SplitType.Equal,
      totalAmountCents: 1000,
    });
    expect(result).not.toHaveProperty("items");
    expect(result).not.toHaveProperty("taxCents");
    expect(result).not.toHaveProperty("tipCents");
  });
});

describe("firebaseToExpense", () => {
  it("converts Firebase data to an equal-split Expense", () => {
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
      splitType: SplitType.Equal,
      totalAmountCents: 5000,
      updatedAt: new Date("2026-03-15T12:00:00.000Z"),
    });
  });

  it("converts Firebase data to an itemized Expense including items, tax, and tip", () => {
    const result = firebaseToExpense("expense-2", {
      createdAt: "2026-03-15T10:00:00.000Z",
      createdBy: "user-1",
      currency: "USD",
      description: "Dinner",
      items: [
        { amountCents: 1200, assignedTo: ["member-1"], description: "Salad" },
      ],
      paidByMemberId: "member-1",
      splitAmong: ["member-1"],
      splitType: "itemized",
      taxCents: 150,
      tipCents: 200,
      totalAmountCents: 1550,
      updatedAt: "2026-03-15T12:00:00.000Z",
    });

    expect(result).toEqual({
      createdAt: new Date("2026-03-15T10:00:00.000Z"),
      createdBy: "user-1",
      currency: "USD",
      description: "Dinner",
      id: "expense-2",
      items: [
        { amountCents: 1200, assignedTo: ["member-1"], description: "Salad" },
      ],
      paidByMemberId: "member-1",
      splitAmong: ["member-1"],
      splitType: SplitType.Itemized,
      taxCents: 150,
      tipCents: 200,
      totalAmountCents: 1550,
      updatedAt: new Date("2026-03-15T12:00:00.000Z"),
    });
  });
});
