"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ExpenseItem, SplitType, type TripMember } from "@/types";
import { ADD_EXPENSE_COPY } from "./AddExpenseFormView.copy";

const copy = ADD_EXPENSE_COPY;

function parseCentsFromInput(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  if (!amountRegex.test(trimmed)) return undefined;
  const [intStr, fracStr] = trimmed.split(".");
  return (
    parseInt(intStr, 10) * 100 +
    (trimmed.includes(".") ? parseInt(fracStr.padEnd(2, "0"), 10) : 0)
  );
}

interface LineItemDraft {
  amountInput: string;
  assignedTo: string[];
  description: string;
}

function makeEmptyLineItem(memberIds: string[]): LineItemDraft {
  return { amountInput: "", assignedTo: memberIds, description: "" };
}

export interface ExpenseFormSubmitData {
  description: string;
  items?: ExpenseItem[];
  paidByMemberId: string;
  splitAmong: string[];
  splitType: SplitType;
  taxCents?: number;
  tipCents?: number;
  totalAmountCents: number;
}

interface AddExpenseFormViewProps {
  error?: string;
  isPending: boolean;
  members: TripMember[];
  onSubmit: (data: ExpenseFormSubmitData) => void;
  tripId: string;
}

export function AddExpenseFormView({
  error,
  isPending,
  members,
  onSubmit,
  tripId,
}: AddExpenseFormViewProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidByMemberId, setPaidByMemberId] = useState(members[0]?.id ?? "");
  const [splitAmong, setSplitAmong] = useState(members.map((m) => m.id));
  const [splitType, setSplitType] = useState<SplitType>(SplitType.Equal);
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([
    makeEmptyLineItem(members.map((m) => m.id)),
  ]);
  const [taxInput, setTaxInput] = useState("");
  const [tipInput, setTipInput] = useState("");
  const [validationError, setValidationError] = useState<string | undefined>(
    undefined,
  );

  const handleToggleMember = (memberId: string) => {
    setSplitAmong((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleToggleItemMember = (itemIndex: number, memberId: string) => {
    setLineItems((prev) =>
      prev.map((item, i) => {
        if (i !== itemIndex) return item;
        const assignedTo = item.assignedTo.includes(memberId)
          ? item.assignedTo.filter((id) => id !== memberId)
          : [...item.assignedTo, memberId];
        return { ...item, assignedTo };
      }),
    );
  };

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      makeEmptyLineItem(members.map((m) => m.id)),
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setValidationError(undefined);

    if (!description.trim()) {
      setValidationError(copy.descriptionRequired);
      return;
    }

    const totalCents = parseCentsFromInput(amount);
    if (totalCents === undefined || totalCents <= 0) {
      setValidationError(copy.amountInvalid);
      return;
    }

    if (splitType === SplitType.Equal) {
      if (splitAmong.length === 0) {
        setValidationError(copy.splitAmongRequired);
        return;
      }

      onSubmit({
        description: description.trim(),
        paidByMemberId,
        splitAmong,
        splitType: SplitType.Equal,
        totalAmountCents: totalCents,
      });
      return;
    }

    // Itemized split
    const parsedItems: ExpenseItem[] = lineItems.map((item) => {
      const amountCents = parseCentsFromInput(item.amountInput) ?? 0;
      return {
        amountCents,
        assignedTo: item.assignedTo,
        description: item.description,
      };
    });

    const taxCents = parseCentsFromInput(taxInput) ?? 0;
    const tipCents = parseCentsFromInput(tipInput) ?? 0;

    const subtotal = parsedItems.reduce(
      (sum, item) => sum + item.amountCents,
      0,
    );
    if (subtotal + taxCents + tipCents !== totalCents) {
      setValidationError(copy.itemizedSubtotalMismatch);
      return;
    }

    const allAssigned = [
      ...new Set(parsedItems.flatMap((item) => item.assignedTo)),
    ];

    onSubmit({
      description: description.trim(),
      items: parsedItems,
      paidByMemberId,
      splitAmong: allAssigned,
      splitType: SplitType.Itemized,
      taxCents: taxCents > 0 ? taxCents : undefined,
      tipCents: tipCents > 0 ? tipCents : undefined,
      totalAmountCents: totalCents,
    });
  };

  const displayError = validationError ?? error;

  const itemizedSubtotal = lineItems.reduce(
    (sum, item) => sum + (parseCentsFromInput(item.amountInput) ?? 0),
    0,
  );
  const taxCentsPreview = parseCentsFromInput(taxInput) ?? 0;
  const tipCentsPreview = parseCentsFromInput(tipInput) ?? 0;
  const totalCentsPreview = parseCentsFromInput(amount) ?? 0;
  const subtotalMismatch =
    splitType === SplitType.Itemized &&
    totalCentsPreview > 0 &&
    itemizedSubtotal + taxCentsPreview + tipCentsPreview !== totalCentsPreview;

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-description">
                {copy.descriptionLabel}
              </Label>
              <Input
                id="expense-description"
                placeholder={copy.descriptionPlaceholder}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setValidationError(undefined);
                }}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount">{copy.amountLabel}</Label>
              <Input
                id="expense-amount"
                type="text"
                inputMode="decimal"
                placeholder={copy.amountPlaceholder}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setValidationError(undefined);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-paid-by">{copy.paidByLabel}</Label>
              <select
                id="expense-paid-by"
                value={members.length > 0 ? paidByMemberId : ""}
                onChange={(e) => {
                  setPaidByMemberId(e.target.value);
                }}
                disabled={members.length === 0}
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {members.length === 0 ? (
                  <option value="" disabled>
                    {copy.noMembersPaidByPlaceholder}
                  </option>
                ) : (
                  members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{copy.splitTypeLabel}</Label>
              <div className="flex gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="split-type"
                    value={SplitType.Equal}
                    checked={splitType === SplitType.Equal}
                    onChange={() => {
                      setSplitType(SplitType.Equal);
                      setValidationError(undefined);
                    }}
                  />
                  {copy.equalSplitLabel}
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="split-type"
                    value={SplitType.Itemized}
                    checked={splitType === SplitType.Itemized}
                    onChange={() => {
                      setSplitType(SplitType.Itemized);
                      setValidationError(undefined);
                    }}
                  />
                  {copy.itemizedSplitLabel}
                </label>
              </div>
            </div>
            {splitType === SplitType.Equal && (
              <div className="space-y-2">
                <Label>{copy.splitAmongLabel}</Label>
                <div className="space-y-1.5">
                  {members.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      {copy.noMembersEmptyState}{" "}
                      <Link
                        href={`/trips/${tripId}`}
                        className="text-primary underline underline-offset-4"
                      >
                        {copy.noMembersGoBackLink}
                      </Link>
                    </p>
                  ) : (
                    members.map((member) => (
                      <label
                        key={member.id}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={splitAmong.includes(member.id)}
                          onChange={() => {
                            handleToggleMember(member.id);
                          }}
                          className="border-input rounded"
                        />
                        {member.name}
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
            {splitType === SplitType.Itemized && (
              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div
                    key={index}
                    data-testid={`line-item-${String(index)}`}
                    className="space-y-2 rounded-md border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {copy.itemDescriptionLabel}
                      </span>
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveLineItem(index);
                          }}
                          className="text-destructive text-xs"
                        >
                          {copy.removeItemButton}
                        </button>
                      )}
                    </div>
                    <Input
                      placeholder={copy.itemDescriptionPlaceholder}
                      value={item.description}
                      onChange={(e) => {
                        setLineItems((prev) =>
                          prev.map((li, i) =>
                            i === index
                              ? { ...li, description: e.target.value }
                              : li,
                          ),
                        );
                      }}
                    />
                    <Label htmlFor={`item-${String(index)}-amount`}>
                      {copy.itemAmountLabel}
                    </Label>
                    <Input
                      id={`item-${String(index)}-amount`}
                      type="text"
                      inputMode="decimal"
                      placeholder={copy.itemAmountPlaceholder}
                      value={item.amountInput}
                      onChange={(e) => {
                        setLineItems((prev) =>
                          prev.map((li, i) =>
                            i === index
                              ? { ...li, amountInput: e.target.value }
                              : li,
                          ),
                        );
                      }}
                    />
                    <Label>{copy.assignedToLabel}</Label>
                    <div className="space-y-1">
                      {members.map((member) => (
                        <label
                          key={member.id}
                          className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={item.assignedTo.includes(member.id)}
                            onChange={() => {
                              handleToggleItemMember(index, member.id);
                            }}
                            className="border-input rounded"
                          />
                          {member.name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLineItem}
                >
                  {copy.addItemButton}
                </Button>
                <div className="space-y-2">
                  <Label htmlFor="expense-tax">{copy.taxLabel}</Label>
                  <Input
                    id="expense-tax"
                    type="text"
                    inputMode="decimal"
                    placeholder={copy.amountPlaceholder}
                    value={taxInput}
                    onChange={(e) => {
                      setTaxInput(e.target.value);
                      setValidationError(undefined);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-tip">{copy.tipLabel}</Label>
                  <Input
                    id="expense-tip"
                    type="text"
                    inputMode="decimal"
                    placeholder={copy.amountPlaceholder}
                    value={tipInput}
                    onChange={(e) => {
                      setTipInput(e.target.value);
                      setValidationError(undefined);
                    }}
                  />
                </div>
                {subtotalMismatch && (
                  <p className="text-destructive text-sm" role="alert">
                    {copy.itemizedSubtotalMismatch}
                  </p>
                )}
              </div>
            )}
            {members.length > 0 && displayError && (
              <p className="text-destructive text-sm" role="alert">
                {displayError}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={isPending || members.length === 0}
              >
                {isPending ? copy.addingButton : copy.submitButton}
              </Button>
              <Link
                href={`/trips/${tripId}`}
                className={buttonVariants({ variant: "outline" })}
              >
                {copy.cancelButton}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
