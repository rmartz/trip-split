import type { Expense, ExpenseItem } from "@/types";
import { SplitType } from "@/types";

interface ExpenseItemFirebase {
  amountCents: number;
  assignedTo: string[];
  description: string;
}

export interface ExpenseFirebase {
  createdAt: string;
  createdBy: string;
  currency: string;
  description: string;
  items?: ExpenseItemFirebase[];
  paidByMemberId: string;
  splitAmong: string[];
  splitType: SplitType;
  taxCents?: number;
  tipCents?: number;
  totalAmountCents: number;
  updatedAt: string;
}

export function expenseToFirebase(
  expense: Omit<Expense, "id" | "createdAt" | "updatedAt">,
): Omit<ExpenseFirebase, "createdAt" | "updatedAt"> {
  const base = {
    createdBy: expense.createdBy,
    currency: expense.currency,
    description: expense.description,
    paidByMemberId: expense.paidByMemberId,
    splitAmong: expense.splitAmong,
    splitType: expense.splitType,
    totalAmountCents: expense.totalAmountCents,
  };

  if (expense.splitType !== SplitType.Itemized) {
    return base;
  }

  return {
    ...base,
    ...(expense.items !== undefined && { items: expense.items }),
    ...(expense.taxCents !== undefined && { taxCents: expense.taxCents }),
    ...(expense.tipCents !== undefined && { tipCents: expense.tipCents }),
  };
}

export function firebaseToExpense(
  id: string,
  data: Record<string, unknown>,
): Expense {
  const splitType = data.splitType as SplitType;

  const base: Expense = {
    createdAt: new Date(data.createdAt as string),
    createdBy: data.createdBy as string,
    currency: data.currency as string,
    description: data.description as string,
    id,
    paidByMemberId: data.paidByMemberId as string,
    splitAmong: data.splitAmong as string[],
    splitType,
    totalAmountCents: data.totalAmountCents as number,
    updatedAt: new Date(data.updatedAt as string),
  };

  if (splitType !== SplitType.Itemized) {
    return base;
  }

  return {
    ...base,
    ...(data.items !== undefined && {
      items: data.items as ExpenseItem[],
    }),
    ...(data.taxCents !== undefined && { taxCents: data.taxCents as number }),
    ...(data.tipCents !== undefined && { tipCents: data.tipCents as number }),
  };
}
