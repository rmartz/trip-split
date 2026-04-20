import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import type { Expense } from "@/types";

import { EXPENSE_CARD_COPY } from "./ExpenseCard.copy";
import { ExpenseCard } from "./ExpenseCard";

function makeExpense(overrides?: Partial<Expense>): Expense {
  return {
    createdAt: new Date("2026-03-15T10:00:00Z"),
    createdBy: "user-1",
    currency: "USD",
    description: "Dinner at the restaurant",
    id: "expense-1",
    paidByMemberId: "member-1",
    splitAmong: ["member-1", "member-2", "member-3"],
    splitType: "equal",
    totalAmountCents: 12050,
    updatedAt: new Date("2026-03-15T10:00:00Z"),
    ...overrides,
  };
}

const meta = {
  title: "Expenses/ExpenseCard",
  component: ExpenseCard,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ExpenseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    expense: makeExpense(),
    paidByName: "Alice",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Dinner at the restaurant")).toBeDefined();
    await expect(
      canvas.getByText(EXPENSE_CARD_COPY.paidBy("Alice"), { exact: false }),
    ).toBeDefined();
    await expect(canvas.getByText("$120.50")).toBeDefined();
  },
};

export const SinglePerson: Story = {
  args: {
    expense: makeExpense({ splitAmong: ["member-1"] }),
    paidByName: "Bob",
  },
};

export const LargeAmount: Story = {
  args: {
    expense: makeExpense({
      totalAmountCents: 150000,
      description: "Hotel stay",
    }),
    paidByName: "Charlie",
  },
};
