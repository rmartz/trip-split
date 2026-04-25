import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { SplitType } from "@/types";
import type { Expense } from "@/types";

import { EditExpenseFormView } from "./EditExpenseFormView";

const members = [
  {
    addedBy: "user-1",
    createdAt: new Date("2026-03-01T00:00:00Z"),
    id: "member-1",
    name: "Alice",
  },
  {
    addedBy: "user-1",
    createdAt: new Date("2026-03-01T00:00:00Z"),
    id: "member-2",
    name: "Bob",
  },
  {
    addedBy: "user-1",
    createdAt: new Date("2026-03-01T00:00:00Z"),
    id: "member-3",
    name: "Charlie",
  },
];

const expense: Expense = {
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
};

const meta = {
  title: "Expenses/EditExpenseFormView",
  component: EditExpenseFormView,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    expense,
    isPending: false,
    members,
    onSubmit: fn(),
    tripId: "trip-1",
  },
} satisfies Meta<typeof EditExpenseFormView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pending: Story = {
  args: {
    isPending: true,
  },
};

export const WithServerError: Story = {
  args: {
    error: "Failed to save expense. Please try again.",
  },
};
