export enum SplitType {
  Equal = "equal",
  Itemized = "itemized",
}

export interface ExpenseItem {
  amountCents: number;
  assignedTo: string[];
  description: string;
}

export interface ExpenseFormSubmitData {
  description: string;
  items?: ExpenseItem[];
  paidByMemberId: string;
  /**
   * For equal-split expenses: the set of members sharing the cost.
   * For itemized expenses: the union of each line item's `assignedTo` arrays.
   * The payer (`paidByMemberId`) is not automatically included in the itemized
   * case — balance calculations for itemized expenses are driven by the items
   * themselves, not by this field.
   */
  splitAmong: string[];
  splitType: SplitType;
  taxCents?: number;
  tipCents?: number;
  totalAmountCents: number;
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
