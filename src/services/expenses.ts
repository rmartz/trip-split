import { get, push, ref, remove, set, update } from "firebase/database";

import { getDb } from "@/lib/database";
import { SplitType } from "@/types";
import type { Expense } from "@/types";
import { expenseToFirebase, firebaseToExpense } from "./expense-schema";

export async function addExpense(
  tripId: string,
  expense: Omit<Expense, "id" | "createdAt" | "updatedAt">,
): Promise<Expense> {
  const db = getDb();
  const now = new Date().toISOString();

  const expenseRef = push(ref(db, `expenses/${tripId}`));

  const data = {
    ...expenseToFirebase(expense),
    createdAt: now,
    updatedAt: now,
  };

  await set(expenseRef, data);

  return firebaseToExpense(expenseRef.key, data);
}

export async function getExpenses(tripId: string): Promise<Expense[]> {
  const db = getDb();
  const snapshot = await get(ref(db, `expenses/${tripId}`));

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val() as Record<string, Record<string, unknown>>;

  return Object.entries(data).map(([id, expenseData]) =>
    firebaseToExpense(id, expenseData),
  );
}

export async function getExpense(
  tripId: string,
  expenseId: string,
): Promise<Expense | undefined> {
  const db = getDb();
  const snapshot = await get(ref(db, `expenses/${tripId}/${expenseId}`));

  if (!snapshot.exists()) {
    return undefined;
  }

  return firebaseToExpense(
    expenseId,
    snapshot.val() as Record<string, unknown>,
  );
}

export async function updateExpense(
  tripId: string,
  expenseId: string,
  updates: Partial<
    Pick<
      Expense,
      | "currency"
      | "description"
      | "paidByMemberId"
      | "splitAmong"
      | "splitType"
      | "totalAmountCents"
    >
  >,
): Promise<void> {
  const db = getDb();

  // Build a partial Firebase payload by converting only the supplied fields
  // through expenseToFirebase so any future field renames stay in sync.
  const sentinel: Omit<Expense, "id" | "createdAt" | "updatedAt"> = {
    createdBy: "",
    currency: "",
    description: "",
    paidByMemberId: "",
    splitAmong: [],
    splitType: SplitType.Equal,
    totalAmountCents: 0,
    ...updates,
  };
  const allFirebase = expenseToFirebase(sentinel);
  const firebaseUpdates = Object.fromEntries(
    Object.keys(updates).map((key) => [
      key,
      allFirebase[key as keyof typeof allFirebase],
    ]),
  );

  await update(ref(db, `expenses/${tripId}/${expenseId}`), {
    ...firebaseUpdates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteExpense(
  tripId: string,
  expenseId: string,
): Promise<void> {
  const db = getDb();
  await remove(ref(db, `expenses/${tripId}/${expenseId}`));
}
