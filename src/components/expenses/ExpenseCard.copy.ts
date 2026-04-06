export const EXPENSE_CARD_COPY = {
  paidBy: (name: string) => `Paid by ${name}`,
  splitting: (count: number) =>
    count === 1 ? "1 person" : `${String(count)} people`,
} as const;
