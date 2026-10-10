export type ExpenseType = "Event" | "Miscellaneous";

export interface ManualExpense {
  id: string;
  organizationId: string;
  expenseType: ExpenseType;
  eventId: string | null;
  eventName: string;
  category: string;
  vendorPayee: string;
  amount: number;
  expenseDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManualExpenseInput {
  expenseType: ExpenseType;
  eventId: string | null;
  category: string;
  vendorPayee: string;
  amount: number;
  expenseDate: string;
  notes: string;
}