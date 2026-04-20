import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { ADD_EXPENSE_COPY } from "./AddExpenseFormView.copy";
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

export const ShowsValidationErrorOnEmptySubmit: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: ADD_EXPENSE_COPY.submitButton }),
    );

    await expect(canvas.getByRole("alert").textContent).toBe(
      ADD_EXPENSE_COPY.descriptionRequired,
    );
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const SubmitsWithValidInput: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByLabelText(ADD_EXPENSE_COPY.descriptionLabel),
      "Dinner at the restaurant",
    );
    await userEvent.type(
      canvas.getByLabelText(ADD_EXPENSE_COPY.amountLabel),
      "120.50",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: ADD_EXPENSE_COPY.submitButton }),
    );

    await expect(args.onSubmit).toHaveBeenCalledWith(
      "Dinner at the restaurant",
      12050,
      "member-1",
      ["member-1", "member-2", "member-3"],
    );
  },
};
