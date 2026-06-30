import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import type { Expense } from "@/types";

import { EXPENSE_CARD_COPY } from "./ExpenseCard.copy";

interface ExpenseCardProps {
  canEdit: boolean;
  expense: Expense;
  onDelete?: () => void;
  paidByName: string;
  tripId: string;
}

export function ExpenseCard({
  canEdit,
  expense,
  onDelete,
  paidByName,
  tripId,
}: ExpenseCardProps) {
  const formattedDate = expense.createdAt.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{expense.description}</span>
        <span className="text-muted-foreground text-xs">
          {EXPENSE_CARD_COPY.paidBy(paidByName)} &middot;{" "}
          {EXPENSE_CARD_COPY.splitting(expense.splitAmong.length)} &middot;{" "}
          {formattedDate}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">
          {formatCurrency(expense.totalAmountCents, expense.currency)}
        </span>
        {canEdit && (
          <div className="flex items-center gap-1">
            <Link
              href={`/trips/${tripId}/expenses/${expense.id}/edit`}
              aria-label={EXPENSE_CARD_COPY.editButton}
              className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            >
              <Pencil />
            </Link>
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={EXPENSE_CARD_COPY.deleteButton}
                    />
                  }
                >
                  <Trash2 />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {EXPENSE_CARD_COPY.deleteConfirmTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {EXPENSE_CARD_COPY.deleteConfirmDescription}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {EXPENSE_CARD_COPY.deleteCancel}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                      {EXPENSE_CARD_COPY.deleteButton}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
