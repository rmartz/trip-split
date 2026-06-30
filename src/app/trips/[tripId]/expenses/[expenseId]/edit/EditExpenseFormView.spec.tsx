import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SplitType } from "@/types";
import type { Expense } from "@/types";

import { EDIT_EXPENSE_COPY } from "./EditExpenseFormView.copy";
import { EditExpenseFormView } from "./EditExpenseFormView";

const members = [
  { addedBy: "user-1", createdAt: new Date(), id: "member-1", name: "Alice" },
  { addedBy: "user-1", createdAt: new Date(), id: "member-2", name: "Bob" },
];

const equalExpense: Expense = {
  createdAt: new Date(),
  createdBy: "user-1",
  currency: "USD",
  description: "Dinner",
  id: "expense-1",
  paidByMemberId: "member-1",
  splitAmong: ["member-1", "member-2"],
  splitType: SplitType.Equal,
  totalAmountCents: 5000,
  updatedAt: new Date(),
};

const itemizedExpense: Expense = {
  ...equalExpense,
  items: [
    {
      amountCents: 3000,
      assignedTo: ["member-1"],
      description: "Steak",
    },
    {
      amountCents: 2000,
      assignedTo: ["member-2"],
      description: "Salad",
    },
  ],
  splitType: SplitType.Itemized,
};

describe("EditExpenseFormView", () => {
  it("does not show the itemized conversion notice for an equal-split expense", () => {
    render(
      <EditExpenseFormView
        expense={equalExpense}
        isPending={false}
        members={members}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    expect(
      screen.queryByText(EDIT_EXPENSE_COPY.itemizedConversionNotice),
    ).toBeNull();
  });

  it("shows the itemized conversion notice for an itemized expense", () => {
    render(
      <EditExpenseFormView
        expense={itemizedExpense}
        isPending={false}
        members={members}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    expect(
      screen.getByText(EDIT_EXPENSE_COPY.itemizedConversionNotice),
    ).toBeDefined();
  });
});
