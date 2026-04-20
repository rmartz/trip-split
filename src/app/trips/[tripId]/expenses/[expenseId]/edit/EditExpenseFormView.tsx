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

const copy = EDIT_EXPENSE_COPY;

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
      setValidationError(copy.descriptionRequired);
      return;
    }

    const amountRegex = /^\d+(\.\d{1,2})?$/;
    if (!amountRegex.test(amount.trim())) {
      setValidationError(copy.amountInvalid);
      return;
    }
    const trimmed = amount.trim();
    const [intStr, fracStr] = trimmed.split(".");
    const totalCents =
      parseInt(intStr, 10) * 100 +
      (trimmed.includes(".") ? parseInt(fracStr.padEnd(2, "0"), 10) : 0);
    if (totalCents <= 0) {
      setValidationError(copy.amountInvalid);
      return;
    }

    if (splitAmong.length === 0) {
      setValidationError(copy.splitAmongRequired);
      return;
    }

    onSubmit(description.trim(), totalCents, paidByMemberId, splitAmong);
  };

  const displayError = validationError ?? error;

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
              <Label>{copy.splitAmongLabel}</Label>
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
