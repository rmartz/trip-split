import type { Meta, StoryObj } from "@storybook/nextjs-vite";

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
    canEdit: false,
    expense: makeExpense(),
    paidByName: "Alice",
    tripId: "trip-1",
  },
};

export const SinglePerson: Story = {
  args: {
    canEdit: false,
    expense: makeExpense({ splitAmong: ["member-1"] }),
    paidByName: "Bob",
    tripId: "trip-1",
  },
};

export const LargeAmount: Story = {
  args: {
    canEdit: false,
    expense: makeExpense({
      totalAmountCents: 150000,
      description: "Hotel stay",
    }),
    paidByName: "Charlie",
    tripId: "trip-1",
  },
};

export const WithEditActions: Story = {
  args: {
    canEdit: true,
    expense: makeExpense(),
    paidByName: "Alice",
    tripId: "trip-1",
  },
};
