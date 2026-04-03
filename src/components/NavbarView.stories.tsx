import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { NavbarView } from "./NavbarView";

const meta = {
  title: "Components/NavbarView",
  component: NavbarView,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof NavbarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignedOut: Story = {
  args: {
    userEmail: undefined,
    onSignOut: fn(),
    isSigningOut: false,
  },
};

export const SignedIn: Story = {
  args: {
    userEmail: "user@example.com",
    onSignOut: fn(),
    isSigningOut: false,
  },
};

export const SigningOut: Story = {
  args: {
    userEmail: "user@example.com",
    onSignOut: fn(),
    isSigningOut: true,
  },
};
