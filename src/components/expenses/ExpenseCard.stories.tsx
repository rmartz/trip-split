import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SplitType } from "@/types";
import type { Expense } from "@/types";

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
    splitType: SplitType.Equal,
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
