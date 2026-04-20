import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Expense, TripMember } from "@/types";

import { EXPENSE_LIST_VIEW_COPY } from "./ExpenseListView.copy";
import { ExpenseListView } from "./ExpenseListView";

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

function makeMember(
  overrides: Partial<TripMember> & Pick<TripMember, "id" | "name">,
): TripMember {
  return {
    addedBy: "user-1",
    createdAt: new Date("2026-03-15T10:00:00Z"),
    ...overrides,
  };
}

describe("ExpenseListView", () => {
  it("shows empty state when no expenses", () => {
    render(<ExpenseListView expenses={[]} isLoading={false} members={[]} />);

    expect(screen.getByText(EXPENSE_LIST_VIEW_COPY.emptyState)).toBeDefined();
  });

  it("does not show empty state when expenses exist", () => {
    render(
      <ExpenseListView
        expenses={[makeExpense()]}
        isLoading={false}
        members={[makeMember({ id: "member-1", name: "Alice" })]}
      />,
    );

    expect(screen.queryByText(EXPENSE_LIST_VIEW_COPY.emptyState)).toBeNull();
  });

  it("renders expense descriptions", () => {
    render(
      <ExpenseListView
        expenses={[makeExpense({ description: "Hotel" })]}
        isLoading={false}
        members={[makeMember({ id: "member-1", name: "Alice" })]}
      />,
    );

    expect(screen.getByText("Hotel")).toBeDefined();
  });

  it("resolves paid-by member name from members list", () => {
    render(
      <ExpenseListView
        expenses={[makeExpense({ paidByMemberId: "member-1" })]}
        isLoading={false}
        members={[makeMember({ id: "member-1", name: "Alice" })]}
      />,
    );

    expect(screen.getByText(/Alice/)).toBeDefined();
  });

  it("falls back to member id when member not found", () => {
    render(
      <ExpenseListView
        expenses={[makeExpense({ paidByMemberId: "unknown-id" })]}
        isLoading={false}
        members={[]}
      />,
    );

    expect(screen.getByText(/unknown-id/)).toBeDefined();
  });

  it("renders expenses sorted most recent first", () => {
    const older = makeExpense({
      id: "expense-1",
      description: "Older",
      createdAt: new Date("2026-01-01T00:00:00Z"),
    });
    const newer = makeExpense({
      id: "expense-2",
      description: "Newer",
      createdAt: new Date("2026-06-01T00:00:00Z"),
    });

    render(
      <ExpenseListView
        expenses={[older, newer]}
        isLoading={false}
        members={[makeMember({ id: "member-1", name: "Alice" })]}
      />,
    );

    const items = screen.getAllByText(/Older|Newer/);
    expect(items[0].textContent).toBe("Newer");
    expect(items[1].textContent).toBe("Older");
  });

  it("does not show empty state while loading", () => {
    render(<ExpenseListView expenses={[]} isLoading={true} members={[]} />);

    expect(screen.queryByText(EXPENSE_LIST_VIEW_COPY.emptyState)).toBeNull();
  });
});
