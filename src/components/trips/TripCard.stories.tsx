import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TripCard } from "./TripCard";

const meta = {
  title: "Components/TripCard",
  component: TripCard,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof TripCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithDescription: Story = {
  args: {
    description: "Beach vacation with friends",
    id: "trip-1",
    memberCount: 4,
    name: "Summer Beach Trip 2026",
  },
};

export const WithoutDescription: Story = {
  args: {
    id: "trip-2",
    memberCount: 2,
    name: "Weekend Getaway",
  },
};

export const SingleMember: Story = {
  args: {
    id: "trip-3",
    memberCount: 1,
    name: "Solo Adventure",
  },
};
