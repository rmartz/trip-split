import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ADD_EXPENSE_COPY } from "./AddExpenseForm.copy";
import { AddExpenseFormView } from "./AddExpenseFormView";

const copy = ADD_EXPENSE_COPY;

const members = [
  { addedBy: "user-1", createdAt: new Date(), id: "member-1", name: "Alice" },
  { addedBy: "user-1", createdAt: new Date(), id: "member-2", name: "Bob" },
];

describe("AddExpenseFormView", () => {
  it("renders the form title and subtitle", () => {
    render(
      <AddExpenseFormView
        isPending={false}
        members={members}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    expect(screen.getByText(copy.subtitle)).toBeDefined();
  });

  it("renders all member names as paid-by options", () => {
    render(
      <AddExpenseFormView
        isPending={false}
        members={members}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    expect(screen.getByRole("option", { name: "Alice" })).toBeDefined();
    expect(screen.getByRole("option", { name: "Bob" })).toBeDefined();
  });

  it("renders all members as checked checkboxes by default", () => {
    render(
      <AddExpenseFormView
        isPending={false}
        members={members}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
    checkboxes.forEach((cb) => {
      expect((cb as HTMLInputElement).checked).toBe(true);
    });
  });

  it("shows description required error when description is empty", () => {
    render(
      <AddExpenseFormView
        isPending={false}
        members={members}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    fireEvent.submit(
      screen.getByRole("button", { name: copy.submitButton }).closest("form")!,
    );

    expect(screen.getByText(copy.descriptionRequired)).toBeDefined();
  });

  it("shows amount invalid error when amount is missing", () => {
    render(
      <AddExpenseFormView
        isPending={false}
        members={members}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(copy.descriptionPlaceholder), {
      target: { value: "Dinner" },
    });
    fireEvent.click(screen.getByRole("button", { name: copy.submitButton }));

    expect(screen.getByText(copy.amountInvalid)).toBeDefined();
  });

  it("shows split among required error when no members are in the trip", () => {
    render(
      <AddExpenseFormView
        isPending={false}
        members={[]}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(copy.descriptionPlaceholder), {
      target: { value: "Dinner" },
    });
    fireEvent.change(screen.getByPlaceholderText(copy.amountPlaceholder), {
      target: { value: "10" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: copy.submitButton }).closest("form")!,
    );

    expect(screen.getByText(copy.splitAmongRequired)).toBeDefined();
  });

  it("calls onSubmit with correct cents and data when valid", () => {
    const onSubmit = vi.fn();
    render(
      <AddExpenseFormView
        isPending={false}
        members={members}
        onSubmit={onSubmit}
        tripId="trip-1"
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(copy.descriptionPlaceholder), {
      target: { value: "Dinner" },
    });
    fireEvent.change(screen.getByPlaceholderText(copy.amountPlaceholder), {
      target: { value: "10.50" },
    });
    fireEvent.click(screen.getByRole("button", { name: copy.submitButton }));

    expect(onSubmit).toHaveBeenCalledWith("Dinner", 1050, "member-1", [
      "member-1",
      "member-2",
    ]);
  });

  it("disables submit button when pending", () => {
    render(
      <AddExpenseFormView
        isPending={true}
        members={members}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    const button = screen.getByText(copy.addingButton).closest("button");
    expect(button).toBeDefined();
    expect(button!.disabled).toBe(true);
  });

  it("shows server error when provided", () => {
    render(
      <AddExpenseFormView
        error="Something went wrong"
        isPending={false}
        members={members}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    expect(screen.getByText("Something went wrong")).toBeDefined();
  });

  it("links cancel to the trip detail page", () => {
    render(
      <AddExpenseFormView
        isPending={false}
        members={members}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    const cancel = screen.getByText(copy.cancelButton);
    expect(cancel.closest("a")?.getAttribute("href")).toBe("/trips/trip-1");
  });
});
