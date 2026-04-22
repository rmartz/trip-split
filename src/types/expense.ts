export enum SplitType {
  Equal = "equal",
  Itemized = "itemized",
}

export interface ExpenseItem {
  amountCents: number;
  assignedTo: string[];
  description: string;
}

export interface Expense {
  createdAt: Date;
  createdBy: string;
  currency: string;
  description: string;
  id: string;
  items?: ExpenseItem[];
  paidByMemberId: string;
  splitAmong: string[];
  splitType: SplitType;
  taxCents?: number;
  tipCents?: number;
  totalAmountCents: number;
  updatedAt: Date;
}
