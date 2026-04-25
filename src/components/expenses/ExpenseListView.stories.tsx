import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Expense, TripMember } from "@/types";
import { SplitType } from "@/types";

import { ExpenseListView } from "./ExpenseListView";

function makeExpense(overrides?: Partial<Expense>): Expense {
  return {
    createdAt: new Date("2026-03-15T10:00:00Z"),
    createdBy: "user-1",
    currency: "USD",
    description: "Dinner at the restaurant",
    id: "expense-1",
    paidByMemberId: "member-1",
    splitAmong: ["member-1", "member-2"],
    splitType: SplitType.Equal,
    totalAmountCents: 12050,
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

const members = [
  makeMember({ id: "member-1", name: "Alice", userId: "user-1" }),
  makeMember({ id: "member-2", name: "Bob" }),
  makeMember({ id: "member-3", name: "Charlie" }),
];

const meta = {
  title: "Expenses/ExpenseListView",
  component: ExpenseListView,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ExpenseListView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithExpenses: Story = {
  args: {
    expenses: [
      makeExpense({
        id: "expense-1",
        description: "Dinner",
        totalAmountCents: 12050,
        paidByMemberId: "member-1",
        splitAmong: ["member-1", "member-2", "member-3"],
        createdAt: new Date("2026-03-15T10:00:00Z"),
      }),
      makeExpense({
        id: "expense-2",
        description: "Hotel",
        totalAmountCents: 45000,
        paidByMemberId: "member-2",
        splitAmong: ["member-1", "member-2"],
        createdAt: new Date("2026-03-14T10:00:00Z"),
      }),
      makeExpense({
        id: "expense-3",
        description: "Taxi",
        totalAmountCents: 2500,
        paidByMemberId: "member-3",
        splitAmong: ["member-1", "member-2", "member-3"],
        createdAt: new Date("2026-03-13T10:00:00Z"),
      }),
    ],
    isLoading: false,
    members,
  },
};

export const Empty: Story = {
  args: {
    expenses: [],
    isLoading: false,
    members,
  },
};

export const Loading: Story = {
  args: {
    expenses: [],
    isLoading: true,
    members,
  },
};
