import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import type { Trip, TripMember } from "@/types";
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
    isAddingMember: false,
    isCreator: true,
    isDeletingTrip: false,
    members: [
      makeMember({ id: "m1", name: "Alice", userId: "user-1" }),
      makeMember({ id: "m2", name: "Bob", userId: "user-2" }),
      makeMember({ id: "m3", name: "Charlie" }),
    ],
    onAddMember: fn(),
    onDeleteTrip: fn(),
    trip: makeTrip({ description: "Beach vacation with friends" }),
  },
};

export const AsMember: Story = {
  args: {
    isAddingMember: false,
    isCreator: false,
    isDeletingTrip: false,
    members: [
      makeMember({ id: "m1", name: "Alice", userId: "user-1" }),
      makeMember({ id: "m2", name: "Bob", userId: "user-2" }),
    ],
    onAddMember: fn(),
    onDeleteTrip: fn(),
    trip: makeTrip(),
  },
};

export const NoDescription: Story = {
  args: {
    isAddingMember: false,
    isCreator: true,
    isDeletingTrip: false,
    members: [makeMember({ id: "m1", name: "Alice", userId: "user-1" })],
    onAddMember: fn(),
    onDeleteTrip: fn(),
    trip: makeTrip(),
  },
};

export const AddingMember: Story = {
  args: {
    isAddingMember: true,
    isCreator: true,
    isDeletingTrip: false,
    members: [makeMember({ id: "m1", name: "Alice", userId: "user-1" })],
    onAddMember: fn(),
    onDeleteTrip: fn(),
    trip: makeTrip(),
  },
};
