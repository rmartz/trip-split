import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ErrorBoundary } from "./ErrorBoundary";

function ThrowingComponent(): never {
  throw new Error("Test error");
}

const meta = {
  title: "Components/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    children: <p>App content renders normally here.</p>,
  },
};

export const WithError: Story = {
  args: {
    children: <ThrowingComponent />,
  },
};
