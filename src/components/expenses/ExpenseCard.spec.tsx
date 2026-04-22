import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
    splitType: "equal",
    totalAmountCents: 5000,
    updatedAt: new Date("2026-03-15T10:00:00Z"),
    ...overrides,
  };
}

describe("ExpenseCard", () => {
  it("renders the description", () => {
    render(
      <ExpenseCard
        canEdit={false}
        expense={makeExpense()}
        paidByName="Alice"
        tripId="trip-1"
      />,
    );

    expect(screen.getByText("Dinner")).toBeDefined();
  });

  it("renders the formatted amount", () => {
    render(
      <ExpenseCard
        canEdit={false}
        expense={makeExpense({ totalAmountCents: 5000 })}
        paidByName="Alice"
        tripId="trip-1"
      />,
    );

    expect(screen.getByText("$50.00")).toBeDefined();
  });

  it("renders who paid", () => {
    render(
      <ExpenseCard
        canEdit={false}
        expense={makeExpense()}
        paidByName="Alice"
        tripId="trip-1"
      />,
    );

    expect(
      screen.getByText(new RegExp(EXPENSE_CARD_COPY.paidBy("Alice"))),
    ).toBeDefined();
  });

  it("renders plural splitting count", () => {
    render(
      <ExpenseCard
        canEdit={false}
        expense={makeExpense({ splitAmong: ["m1", "m2", "m3"] })}
        paidByName="Alice"
        tripId="trip-1"
      />,
    );

    expect(
      screen.getByText(new RegExp(EXPENSE_CARD_COPY.splitting(3))),
    ).toBeDefined();
  });

  it("renders singular splitting count", () => {
    render(
      <ExpenseCard
        canEdit={false}
        expense={makeExpense({ splitAmong: ["m1"] })}
        paidByName="Alice"
        tripId="trip-1"
      />,
    );

    expect(
      screen.getByText(new RegExp(EXPENSE_CARD_COPY.splitting(1))),
    ).toBeDefined();
  });

  it("does not show edit/delete buttons when canEdit is false", () => {
    render(
      <ExpenseCard
        canEdit={false}
        expense={makeExpense()}
        paidByName="Alice"
        tripId="trip-1"
      />,
    );

    expect(
      screen.queryByRole("link", { name: EXPENSE_CARD_COPY.editButton }),
    ).toBeNull();
    expect(
      screen.queryByRole("button", { name: EXPENSE_CARD_COPY.deleteButton }),
    ).toBeNull();
  });

  it("shows edit and delete buttons when canEdit is true and onDelete is provided", () => {
    render(
      <ExpenseCard
        canEdit={true}
        expense={makeExpense()}
        onDelete={vi.fn()}
        paidByName="Alice"
        tripId="trip-1"
      />,
    );

    expect(
      screen.getByRole("link", { name: EXPENSE_CARD_COPY.editButton }),
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: EXPENSE_CARD_COPY.deleteButton }),
    ).toBeDefined();
  });

  it("shows only the edit button when canEdit is true but onDelete is not provided", () => {
    render(
      <ExpenseCard
        canEdit={true}
        expense={makeExpense()}
        paidByName="Alice"
        tripId="trip-1"
      />,
    );

    expect(
      screen.getByRole("link", { name: EXPENSE_CARD_COPY.editButton }),
    ).toBeDefined();
    expect(
      screen.queryByRole("button", { name: EXPENSE_CARD_COPY.deleteButton }),
    ).toBeNull();
  });

  it("edit button links to the edit page", () => {
    render(
      <ExpenseCard
        canEdit={true}
        expense={makeExpense({ id: "expense-1" })}
        paidByName="Alice"
        tripId="trip-1"
      />,
    );

    const editLink = screen.getByRole("link", {
      name: EXPENSE_CARD_COPY.editButton,
    });
    expect(editLink.getAttribute("href")).toBe(
      "/trips/trip-1/expenses/expense-1/edit",
    );
  });
});
