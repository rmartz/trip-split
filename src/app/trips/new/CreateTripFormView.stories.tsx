import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { CreateTripFormView } from "./CreateTripFormView";

const meta = {
  title: "Pages/CreateTripFormView",
  component: CreateTripFormView,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CreateTripFormView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isPending: false,
    onSubmit: fn(),
  },
};

export const Submitting: Story = {
  args: {
    isPending: true,
    onSubmit: fn(),
  },
};

export const WithError: Story = {
  args: {
    error: "Something went wrong. Please try again.",
    isPending: false,
    onSubmit: fn(),
  },
};
