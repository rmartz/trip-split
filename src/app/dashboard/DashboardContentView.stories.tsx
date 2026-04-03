import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DashboardContentView } from "./DashboardContentView";

const meta = {
  title: "Pages/DashboardContentView",
  component: DashboardContentView,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DashboardContentView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    isEmpty: true,
  },
};

export const WithTrips: Story = {
  args: {
    isEmpty: false,
  },
};
