import { describe, expect, it } from "vitest";

import type { Expense, TripMember } from "@/types";

import { calculateBalances } from "./balances";

function makeExpense(overrides?: Partial<Expense>): Expense {
  return {
    createdAt: new Date("2026-03-15T10:00:00Z"),
    createdBy: "user-1",
    currency: "USD",
    description: "Dinner",
    id: "expense-1",
    paidByMemberId: "member-1",
    splitAmong: ["member-1", "member-2"],
    splitType: "equal",
    totalAmountCents: 1000,
    updatedAt: new Date("2026-03-15T10:00:00Z"),
    ...overrides,
  };
}

function makeMember(
  overrides: Partial<TripMember> & Pick<TripMember, "id" | "name">,
): TripMember {
  return {
    addedBy: "user-1",
    createdAt: new Date("2026-03-15T10:00:00Z"),
    ...overrides,
  };
}

describe("calculateBalances", () => {
  it("returns a balance entry for every member", () => {
    const members = [
      makeMember({ id: "member-1", name: "Alice" }),
      makeMember({ id: "member-2", name: "Bob" }),
    ];
    const result = calculateBalances([], members);
    expect(result).toHaveLength(2);
    expect(result[0].memberId).toBe("member-1");
    expect(result[1].memberId).toBe("member-2");
  });

  it("sets all balances to zero when there are no expenses", () => {
    const members = [makeMember({ id: "member-1", name: "Alice" })];
    const result = calculateBalances([], members);
    expect(result[0]).toEqual({
      memberId: "member-1",
      memberName: "Alice",
      net: 0,
      owes: 0,
      paid: 0,
    });
  });

  describe("equal split", () => {
    it("splits an even amount equally between two members", () => {
      const members = [
        makeMember({ id: "member-1", name: "Alice" }),
        makeMember({ id: "member-2", name: "Bob" }),
      ];
      const expenses = [
        makeExpense({
          paidByMemberId: "member-1",
          splitAmong: ["member-1", "member-2"],
          splitType: "equal",
          totalAmountCents: 1000,
        }),
      ];
      const result = calculateBalances(expenses, members);
      const alice = result.find((b) => b.memberId === "member-1")!;
      const bob = result.find((b) => b.memberId === "member-2")!;

      expect(alice).toEqual({
        memberId: "member-1",
        memberName: "Alice",
        net: 500,
        owes: 500,
        paid: 1000,
      });
      expect(bob).toEqual({
        memberId: "member-2",
        memberName: "Bob",
        net: -500,
        owes: 500,
        paid: 0,
      });
    });

    it("distributes remainder cents so all cents are accounted for ($10 among 3)", () => {
      const members = [
        makeMember({ id: "member-1", name: "Alice" }),
        makeMember({ id: "member-2", name: "Bob" }),
        makeMember({ id: "member-3", name: "Charlie" }),
      ];
      const expenses = [
        makeExpense({
          paidByMemberId: "member-1",
          splitAmong: ["member-1", "member-2", "member-3"],
          splitType: "equal",
          totalAmountCents: 1000,
        }),
      ];
      const result = calculateBalances(expenses, members);
      const alice = result.find((b) => b.memberId === "member-1")!;
      const bob = result.find((b) => b.memberId === "member-2")!;
      const charlie = result.find((b) => b.memberId === "member-3")!;

      expect(alice.owes).toBe(334);
      expect(bob.owes).toBe(333);
      expect(charlie.owes).toBe(333);
      expect(alice.owes + bob.owes + charlie.owes).toBe(1000);
      expect(alice.net).toBe(666);
      expect(bob.net).toBe(-333);
      expect(charlie.net).toBe(-333);
    });
  });

  describe("itemized split", () => {
    it("splits an itemized expense (including tax and tip) equally among splitAmong members", () => {
      const members = [
        makeMember({ id: "member-1", name: "Alice" }),
        makeMember({ id: "member-2", name: "Bob" }),
        makeMember({ id: "member-3", name: "Charlie" }),
      ];
      // $90 base + $10 tax/tip = $100 total, split among 2 members
      const expenses = [
        makeExpense({
          id: "expense-1",
          paidByMemberId: "member-1",
          splitAmong: ["member-2", "member-3"],
          splitType: "itemized",
          totalAmountCents: 10000,
        }),
      ];
      const result = calculateBalances(expenses, members);
      const alice = result.find((b) => b.memberId === "member-1")!;
      const bob = result.find((b) => b.memberId === "member-2")!;
      const charlie = result.find((b) => b.memberId === "member-3")!;

      expect(alice.paid).toBe(10000);
      expect(alice.owes).toBe(0);
      expect(alice.net).toBe(10000);
      expect(bob.paid).toBe(0);
      expect(bob.owes).toBe(5000);
      expect(bob.net).toBe(-5000);
      expect(charlie.paid).toBe(0);
      expect(charlie.owes).toBe(5000);
      expect(charlie.net).toBe(-5000);
      expect(bob.owes + charlie.owes).toBe(10000);
    });
  });

  describe("single payer", () => {
    it("credits the single payer and charges all split members", () => {
      const members = [
        makeMember({ id: "member-1", name: "Alice" }),
        makeMember({ id: "member-2", name: "Bob" }),
        makeMember({ id: "member-3", name: "Charlie" }),
      ];
      const expenses = [
        makeExpense({
          paidByMemberId: "member-1",
          splitAmong: ["member-1", "member-2", "member-3"],
          totalAmountCents: 3000,
        }),
      ];
      const result = calculateBalances(expenses, members);
      const alice = result.find((b) => b.memberId === "member-1")!;
      const bob = result.find((b) => b.memberId === "member-2")!;
      const charlie = result.find((b) => b.memberId === "member-3")!;

      expect(alice.paid).toBe(3000);
      expect(alice.owes).toBe(1000);
      expect(alice.net).toBe(2000);
      expect(bob.net).toBe(-1000);
      expect(charlie.net).toBe(-1000);
    });
  });

  describe("multiple payers", () => {
    it("accumulates paid and owes correctly across multiple expenses with different payers", () => {
      const members = [
        makeMember({ id: "member-1", name: "Alice" }),
        makeMember({ id: "member-2", name: "Bob" }),
      ];
      const expenses = [
        makeExpense({
          id: "expense-1",
          paidByMemberId: "member-1",
          splitAmong: ["member-1", "member-2"],
          totalAmountCents: 2000,
        }),
        makeExpense({
          id: "expense-2",
          paidByMemberId: "member-2",
          splitAmong: ["member-1", "member-2"],
          totalAmountCents: 6000,
        }),
      ];
      const result = calculateBalances(expenses, members);
      const alice = result.find((b) => b.memberId === "member-1")!;
      const bob = result.find((b) => b.memberId === "member-2")!;

      expect(alice.paid).toBe(2000);
      expect(alice.owes).toBe(4000);
      expect(alice.net).toBe(-2000);
      expect(bob.paid).toBe(6000);
      expect(bob.owes).toBe(4000);
      expect(bob.net).toBe(2000);
    });

    it("nets sum to zero across all members", () => {
      const members = [
        makeMember({ id: "member-1", name: "Alice" }),
        makeMember({ id: "member-2", name: "Bob" }),
        makeMember({ id: "member-3", name: "Charlie" }),
      ];
      const expenses = [
        makeExpense({
          id: "expense-1",
          paidByMemberId: "member-1",
          splitAmong: ["member-1", "member-2", "member-3"],
          totalAmountCents: 997,
        }),
        makeExpense({
          id: "expense-2",
          paidByMemberId: "member-2",
          splitAmong: ["member-2", "member-3"],
          totalAmountCents: 501,
        }),
        makeExpense({
          id: "expense-3",
          paidByMemberId: "member-3",
          splitAmong: ["member-1", "member-2", "member-3"],
          totalAmountCents: 1200,
        }),
      ];
      const result = calculateBalances(expenses, members);
      const totalNet = result.reduce((sum, b) => sum + b.net, 0);
      expect(totalNet).toBe(0);
    });
  });
});
