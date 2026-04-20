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
import type { Expense, TripMember } from "@/types";
import { EDIT_EXPENSE_COPY } from "./EditExpenseFormView.copy";

interface EditExpenseFormViewProps {
  error?: string;
  expense: Expense;
  isPending: boolean;
  members: TripMember[];
  onSubmit: (
    description: string,
    totalAmountCents: number,
    paidByMemberId: string,
    splitAmong: string[],
  ) => void;
  tripId: string;
}

export function EditExpenseFormView({
  error,
  expense,
  isPending,
  members,
  onSubmit,
  tripId,
}: EditExpenseFormViewProps) {
  const initialAmount =
    expense.totalAmountCents % 100 === 0
      ? String(expense.totalAmountCents / 100)
      : (expense.totalAmountCents / 100).toFixed(2);

  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(initialAmount);
  const [paidByMemberId, setPaidByMemberId] = useState(expense.paidByMemberId);
  const [splitAmong, setSplitAmong] = useState(expense.splitAmong);
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

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setValidationError(undefined);

    if (!description.trim()) {
      setValidationError(EDIT_EXPENSE_COPY.descriptionRequired);
      return;
    }

    const trimmedAmount = amount.trim();
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    if (!amountRegex.test(trimmedAmount)) {
      setValidationError(EDIT_EXPENSE_COPY.amountInvalid);
      return;
    }
    const [intStr, fracStr] = trimmedAmount.split(".");
    const totalCents =
      parseInt(intStr, 10) * 100 +
      (trimmedAmount.includes(".") ? parseInt(fracStr.padEnd(2, "0"), 10) : 0);
    if (totalCents <= 0) {
      setValidationError(EDIT_EXPENSE_COPY.amountInvalid);
      return;
    }

    if (splitAmong.length === 0) {
      setValidationError(EDIT_EXPENSE_COPY.splitAmongRequired);
      return;
    }

    onSubmit(description.trim(), totalCents, paidByMemberId, splitAmong);
  };

  const displayError = validationError ?? error;

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{EDIT_EXPENSE_COPY.title}</CardTitle>
          <CardDescription>{EDIT_EXPENSE_COPY.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-description">
                {EDIT_EXPENSE_COPY.descriptionLabel}
              </Label>
              <Input
                id="expense-description"
                placeholder={EDIT_EXPENSE_COPY.descriptionPlaceholder}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setValidationError(undefined);
                }}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount">
                {EDIT_EXPENSE_COPY.amountLabel}
              </Label>
              <Input
                id="expense-amount"
                type="text"
                inputMode="decimal"
                placeholder={EDIT_EXPENSE_COPY.amountPlaceholder}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setValidationError(undefined);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-paid-by">
                {EDIT_EXPENSE_COPY.paidByLabel}
              </Label>
              <select
                id="expense-paid-by"
                value={paidByMemberId}
                onChange={(e) => {
                  setPaidByMemberId(e.target.value);
                }}
                className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>{EDIT_EXPENSE_COPY.splitAmongLabel}</Label>
              <div className="space-y-1.5">
                {members.map((member) => (
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
                ))}
              </div>
            </div>
            {displayError && (
              <p className="text-destructive text-sm" role="alert">
                {displayError}
              </p>
            )}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending
                  ? EDIT_EXPENSE_COPY.addingButton
                  : EDIT_EXPENSE_COPY.submitButton}
              </Button>
              <Link
                href={`/trips/${tripId}`}
                className={buttonVariants({ variant: "outline" })}
              >
                {EDIT_EXPENSE_COPY.cancelButton}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
