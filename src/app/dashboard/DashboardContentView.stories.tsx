import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Trip } from "@/types";
import { DashboardContentView } from "./DashboardContentView";

function makeTrip(overrides: Partial<Trip> & Pick<Trip, "id" | "name">): Trip {
  return {
    createdAt: new Date("2026-03-15T10:00:00Z"),
    createdBy: "user-1",
    updatedAt: new Date("2026-03-15T10:00:00Z"),
    ...overrides,
  };
}

const meta = {
  title: "Pages/DashboardContentView",
  component: DashboardContentView,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DashboardContentView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    isLoading: true,
    trips: [],
  },
};

export const Empty: Story = {
  args: {
    isLoading: false,
    trips: [],
  },
};

export const WithTrips: Story = {
  args: {
    isLoading: false,
    trips: [
      makeTrip({
        description: "Beach vacation with friends",
        id: "trip-1",
        name: "Summer Beach Trip 2026",
      }),
      makeTrip({
        id: "trip-2",
        name: "Weekend Getaway",
      }),
      makeTrip({
        description: "Annual ski trip to Colorado",
        id: "trip-3",
        name: "Ski Trip 2026",
      }),
    ],
  },
};
