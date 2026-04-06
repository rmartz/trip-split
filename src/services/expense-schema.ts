import type { Expense, SplitType } from "@/types";

export interface ExpenseFirebase {
  createdAt: string;
  createdBy: string;
  currency: string;
  description: string;
  paidByMemberId: string;
  splitAmong: string[];
  splitType: SplitType;
  totalAmountCents: number;
  updatedAt: string;
}

export function expenseToFirebase(
  expense: Omit<Expense, "id" | "createdAt" | "updatedAt">,
): Omit<ExpenseFirebase, "createdAt" | "updatedAt"> {
  return {
    createdBy: expense.createdBy,
    currency: expense.currency,
    description: expense.description,
    paidByMemberId: expense.paidByMemberId,
    splitAmong: expense.splitAmong,
    splitType: expense.splitType,
    totalAmountCents: expense.totalAmountCents,
  };
}

export function firebaseToExpense(
  id: string,
  data: Record<string, unknown>,
): Expense {
  return {
    createdAt: new Date(data.createdAt as string),
    createdBy: data.createdBy as string,
    currency: data.currency as string,
    description: data.description as string,
    id,
    paidByMemberId: data.paidByMemberId as string,
    splitAmong: data.splitAmong as string[],
    splitType: data.splitType as SplitType,
    totalAmountCents: data.totalAmountCents as number,
    updatedAt: new Date(data.updatedAt as string),
  };
}
