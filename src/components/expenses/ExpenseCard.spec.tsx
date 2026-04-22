import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SplitType } from "@/types";
import type { Expense } from "@/types";

import { EXPENSE_CARD_COPY } from "./ExpenseCard.copy";
import { ExpenseCard } from "./ExpenseCard";

function makeExpense(overrides?: Partial<Expense>): Expense {
  return {
    createdAt: new Date("2026-03-15T10:00:00Z"),
    createdBy: "user-1",
    currency: "USD",
    description: "Dinner",
    id: "expense-1",
    paidByMemberId: "member-1",
    splitAmong: ["member-1", "member-2"],
    splitType: SplitType.Equal,
    totalAmountCents: 5000,
    updatedAt: new Date("2026-03-15T10:00:00Z"),
    ...overrides,
  };
}

describe("ExpenseCard", () => {
  it("renders the description", () => {
    render(<ExpenseCard expense={makeExpense()} paidByName="Alice" />);

    expect(screen.getByText("Dinner")).toBeDefined();
  });

  it("renders the formatted amount", () => {
    render(
      <ExpenseCard
        expense={makeExpense({ totalAmountCents: 5000 })}
        paidByName="Alice"
      />,
    );

    expect(screen.getByText("$50.00")).toBeDefined();
  });

  it("renders who paid", () => {
    render(<ExpenseCard expense={makeExpense()} paidByName="Alice" />);

    expect(
      screen.getByText(new RegExp(EXPENSE_CARD_COPY.paidBy("Alice"))),
    ).toBeDefined();
  });

  it("renders plural splitting count", () => {
    render(
      <ExpenseCard
        expense={makeExpense({ splitAmong: ["m1", "m2", "m3"] })}
        paidByName="Alice"
      />,
    );

    expect(
      screen.getByText(new RegExp(EXPENSE_CARD_COPY.splitting(3))),
    ).toBeDefined();
  });

  it("renders singular splitting count", () => {
    render(
      <ExpenseCard
        expense={makeExpense({ splitAmong: ["m1"] })}
        paidByName="Alice"
      />,
    );

    expect(
      screen.getByText(new RegExp(EXPENSE_CARD_COPY.splitting(1))),
    ).toBeDefined();
  });
});
