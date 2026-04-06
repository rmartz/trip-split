export type SplitType = "equal" | "itemized";

export interface Expense {
  createdAt: Date;
  createdBy: string;
  currency: string;
  description: string;
  id: string;
  paidByMemberId: string;
  splitAmong: string[];
  splitType: SplitType;
  totalAmountCents: number;
  updatedAt: Date;
}
