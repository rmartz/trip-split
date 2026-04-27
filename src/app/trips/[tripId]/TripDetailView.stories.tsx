import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { SplitType } from "@/types";
import type { Expense, Trip, TripMember } from "@/types";
import { TripDetailView } from "./TripDetailView";

function makeTrip(overrides?: Partial<Trip>): Trip {
  return {
    createdAt: new Date("2026-03-15T10:00:00Z"),
    createdBy: "user-1",
    id: "trip-1",
    name: "Summer Beach Trip 2026",
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

function makeExpense(overrides?: Partial<Expense>): Expense {
  return {
    createdAt: new Date("2026-03-15T10:00:00Z"),
    createdBy: "user-1",
    currency: "USD",
    description: "Dinner",
    id: "expense-1",
    paidByMemberId: "m1",
    splitAmong: ["m1", "m2"],
    splitType: SplitType.Equal,
    totalAmountCents: 12050,
    updatedAt: new Date("2026-03-15T10:00:00Z"),
    ...overrides,
  };
}

const meta = {
  title: "Pages/TripDetailView",
  component: TripDetailView,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof TripDetailView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AsCreator: Story = {
  args: {
    expenses: [makeExpense()],
    isAddingMember: false,
    isCreator: true,
    isDeletingTrip: false,
    isExpensesLoading: false,
    members: [
      makeMember({ id: "m1", name: "Alice", userId: "user-1" }),
      makeMember({ id: "m2", name: "Bob", userId: "user-2" }),
      makeMember({ id: "m3", name: "Charlie" }),
    ],
    onAddMember: fn(),
    onDeleteExpense: fn(),
    onDeleteTrip: fn(),
    trip: makeTrip({ description: "Beach vacation with friends" }),
  },
};

export const AsMember: Story = {
  args: {
    expenses: [makeExpense()],
    isAddingMember: false,
    isCreator: false,
    isDeletingTrip: false,
    isExpensesLoading: false,
    members: [
      makeMember({ id: "m1", name: "Alice", userId: "user-1" }),
      makeMember({ id: "m2", name: "Bob", userId: "user-2" }),
    ],
    onAddMember: fn(),
    onDeleteExpense: fn(),
    onDeleteTrip: fn(),
    trip: makeTrip(),
  },
};

export const NoDescription: Story = {
  args: {
    expenses: [],
    isAddingMember: false,
    isCreator: true,
    isDeletingTrip: false,
    isExpensesLoading: false,
    members: [makeMember({ id: "m1", name: "Alice", userId: "user-1" })],
    onAddMember: fn(),
    onDeleteExpense: fn(),
    onDeleteTrip: fn(),
    trip: makeTrip(),
  },
};

export const AddingMember: Story = {
  args: {
    expenses: [],
    isAddingMember: true,
    isCreator: true,
    isDeletingTrip: false,
    isExpensesLoading: false,
    members: [makeMember({ id: "m1", name: "Alice", userId: "user-1" })],
    onAddMember: fn(),
    onDeleteExpense: fn(),
    onDeleteTrip: fn(),
    trip: makeTrip(),
  },
};

export const ExpensesLoading: Story = {
  args: {
    expenses: [],
    isAddingMember: false,
    isCreator: true,
    isDeletingTrip: false,
    isExpensesLoading: true,
    members: [makeMember({ id: "m1", name: "Alice", userId: "user-1" })],
    onAddMember: fn(),
    onDeleteExpense: fn(),
    onDeleteTrip: fn(),
    trip: makeTrip(),
  },
};
