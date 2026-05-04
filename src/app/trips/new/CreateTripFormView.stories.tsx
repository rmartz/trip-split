import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { CREATE_TRIP_COPY } from "./CreateTripForm.copy";
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

export const ShowsValidationErrorOnEmptySubmit: Story = {
  args: {
    isPending: false,
    onSubmit: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole("button", {
      name: CREATE_TRIP_COPY.submitButton,
    });

    await userEvent.click(submitButton);

    await expect(canvas.getByRole("alert").textContent).toBe(
      CREATE_TRIP_COPY.nameRequired,
    );
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const SubmitsWithValidInput: Story = {
  args: {
    isPending: false,
    onSubmit: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByLabelText(CREATE_TRIP_COPY.nameLabel),
      "Beach Weekend",
    );
    await userEvent.type(
      canvas.getByLabelText(CREATE_TRIP_COPY.descriptionLabel),
      "Summer trip",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: CREATE_TRIP_COPY.submitButton }),
    );

    await expect(args.onSubmit).toHaveBeenCalledWith(
      "Beach Weekend",
      "Summer trip",
    );
  },
};
