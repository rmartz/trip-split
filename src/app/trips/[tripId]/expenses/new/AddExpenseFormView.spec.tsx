import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SplitType } from "@/types";

import { ADD_EXPENSE_COPY } from "./AddExpenseFormView.copy";
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

  it("shows amount invalid error for partial string input", () => {
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
    fireEvent.change(screen.getByPlaceholderText(copy.amountPlaceholder), {
      target: { value: "10abc" },
    });
    fireEvent.click(screen.getByRole("button", { name: copy.submitButton }));

    expect(screen.getByText(copy.amountInvalid)).toBeDefined();
  });

  it("shows split among required error when all members are unchecked", () => {
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
    fireEvent.change(screen.getByPlaceholderText(copy.amountPlaceholder), {
      target: { value: "10" },
    });
    screen.getAllByRole("checkbox").forEach((cb) => fireEvent.click(cb));
    fireEvent.submit(
      screen.getByRole("button", { name: copy.submitButton }).closest("form")!,
    );

    expect(screen.getByText(copy.splitAmongRequired)).toBeDefined();
  });

  it("disables submit and shows empty state when no members exist", () => {
    render(
      <AddExpenseFormView
        isPending={false}
        members={[]}
        onSubmit={vi.fn()}
        tripId="trip-1"
      />,
    );

    expect(screen.getByText(copy.noMembersEmptyState)).toBeDefined();
    const button = screen
      .getByRole("button", { name: copy.submitButton })
      .closest("button");
    expect(button!.disabled).toBe(true);
  });

  it("calls onSubmit with correct data for equal split", () => {
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

    expect(onSubmit).toHaveBeenCalledWith({
      description: "Dinner",
      paidByMemberId: "member-1",
      splitAmong: ["member-1", "member-2"],
      splitType: SplitType.Equal,
      totalAmountCents: 1050,
    });
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

  describe("itemized split", () => {
    it("shows itemized form when itemized is selected", () => {
      render(
        <AddExpenseFormView
          isPending={false}
          members={members}
          onSubmit={vi.fn()}
          tripId="trip-1"
        />,
      );

      const itemizedRadio = screen.getByRole("radio", {
        name: copy.itemizedSplitLabel,
      });
      fireEvent.click(itemizedRadio);

      expect(screen.getByText(copy.taxLabel)).toBeDefined();
      expect(screen.getByText(copy.tipLabel)).toBeDefined();
      expect(
        screen.getByRole("button", { name: copy.addItemButton }),
      ).toBeDefined();
    });

    it("shows mismatch warning when subtotal + tax + tip does not equal total", () => {
      render(
        <AddExpenseFormView
          isPending={false}
          members={members}
          onSubmit={vi.fn()}
          tripId="trip-1"
        />,
      );

      fireEvent.change(screen.getByPlaceholderText(copy.amountPlaceholder), {
        target: { value: "20.00" },
      });
      fireEvent.click(
        screen.getByRole("radio", { name: copy.itemizedSplitLabel }),
      );

      const itemAmountInputs = screen.getAllByPlaceholderText(
        copy.itemAmountPlaceholder,
      );
      fireEvent.change(itemAmountInputs[0], { target: { value: "5.00" } });

      expect(screen.getByText(copy.itemizedSubtotalMismatch)).toBeDefined();
    });

    it("calls onSubmit with itemized data when valid", () => {
      const onSubmit = vi.fn();
      render(
        <AddExpenseFormView
          isPending={false}
          members={members}
          onSubmit={onSubmit}
          tripId="trip-1"
        />,
      );

      fireEvent.change(
        screen.getByPlaceholderText(copy.descriptionPlaceholder),
        { target: { value: "Dinner" } },
      );
      fireEvent.change(screen.getByPlaceholderText(copy.amountPlaceholder), {
        target: { value: "15.00" },
      });
      fireEvent.click(
        screen.getByRole("radio", { name: copy.itemizedSplitLabel }),
      );

      const itemDescInputs = screen.getAllByPlaceholderText(
        copy.itemDescriptionPlaceholder,
      );
      fireEvent.change(itemDescInputs[0], { target: { value: "Salad" } });

      const itemCard = screen.getByTestId("line-item-0");
      fireEvent.change(within(itemCard).getByLabelText(copy.itemAmountLabel), {
        target: { value: "13.00" },
      });

      // Tax
      fireEvent.change(screen.getByLabelText(/Tax/), {
        target: { value: "1.00" },
      });
      // Tip
      fireEvent.change(screen.getByLabelText(/Tip/), {
        target: { value: "1.00" },
      });

      fireEvent.click(screen.getByRole("button", { name: copy.submitButton }));

      expect(onSubmit).toHaveBeenCalledWith({
        description: "Dinner",
        items: [
          {
            amountCents: 1300,
            assignedTo: ["member-1", "member-2"],
            description: "Salad",
          },
        ],
        paidByMemberId: "member-1",
        splitAmong: ["member-1", "member-2"],
        splitType: SplitType.Itemized,
        taxCents: 100,
        tipCents: 100,
        totalAmountCents: 1500,
      });
    });
  });
});
