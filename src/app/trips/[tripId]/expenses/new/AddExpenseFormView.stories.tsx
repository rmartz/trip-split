import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { AddExpenseFormView } from "./AddExpenseFormView";

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

const meta = {
  title: "Expenses/AddExpenseFormView",
  component: AddExpenseFormView,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    isPending: false,
    members,
    onSubmit: fn(),
    tripId: "trip-1",
  },
} satisfies Meta<typeof AddExpenseFormView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoMembers: Story = {
  args: {
    members: [],
  },
};

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
