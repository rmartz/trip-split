export const EXPENSE_CARD_COPY = {
  deleteButton: "Delete",
  deleteCancel: "Cancel",
  deleteConfirmDescription:
    "This action cannot be undone. This expense will be permanently removed.",
  deleteConfirmTitle: "Delete expense?",
  editButton: "Edit",
  paidBy: (name: string) => `Paid by ${name}`,
  splitting: (count: number) =>
    count === 1 ? "1 person" : `${String(count)} people`,
} as const;
