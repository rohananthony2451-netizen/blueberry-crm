import { createClient } from "@/lib/supabase/browser";
import type {
  ManualExpense,
  ManualExpenseInput,
} from "../manual-expense.types";

interface ManualExpenseRow {
  id: string;
  organization_id: string;
  expense_type: "Event" | "Miscellaneous";
  event_id: string | null;
  category: string;
  vendor_payee: string | null;
  amount: number | string;
  expense_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  events: { event_name: string } | null;
}

const SELECT_FIELDS = `
  *,
  events (event_name)
`;

function mapExpense(row: ManualExpenseRow): ManualExpense {
  return {
    id: row.id,
    organizationId: row.organization_id,
    expenseType: row.expense_type,
    eventId: row.event_id,
    eventName: row.events?.event_name ?? "",
    category: row.category,
    vendorPayee: row.vendor_payee ?? "",
    amount: Number(row.amount),
    expenseDate: row.expense_date,
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function validateInput(input: ManualExpenseInput) {
  if (!["Event", "Miscellaneous"].includes(input.expenseType)) {
    throw new Error("Choose a valid expense type.");
  }

  if (input.expenseType === "Event" && !input.eventId) {
    throw new Error("Select an event for this expense.");
  }

  if (input.expenseType === "Miscellaneous" && input.eventId) {
    throw new Error("Miscellaneous expenses cannot be linked to an event.");
  }

  if (!input.category.trim()) {
    throw new Error("Category is required.");
  }

  if (!Number.isFinite(input.amount) || input.amount < 0) {
    throw new Error("Enter a valid non-negative amount.");
  }

  if (!input.expenseDate) {
    throw new Error("Date is required.");
  }
}

function toRow(input: ManualExpenseInput) {
  return {
    expense_type: input.expenseType,
    event_id: input.expenseType === "Event" ? input.eventId : null,
    category: input.category.trim(),
    vendor_payee: input.vendorPayee.trim() || null,
    amount: input.amount,
    expense_date: input.expenseDate,
    notes: input.notes.trim() || null,
  };
}

export async function getManualExpenses(): Promise<ManualExpense[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("expenses")
    .select(SELECT_FIELDS)
    .order("expense_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as ManualExpenseRow[]).map(mapExpense);
}

export async function createManualExpense(
  input: ManualExpenseInput
): Promise<ManualExpense> {
  validateInput(input);

  const supabase = createClient();
  const { data: organizationId, error: organizationError } =
    await supabase.rpc("get_user_organization_id");

  if (organizationError) throw new Error(organizationError.message);
  if (!organizationId) throw new Error("No organization found for this user.");

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      organization_id: organizationId,
      ...toRow(input),
    })
    .select(SELECT_FIELDS)
    .single();

  if (error) throw new Error(error.message);

  return mapExpense(data as unknown as ManualExpenseRow);
}

export async function updateManualExpense(
  id: string,
  input: ManualExpenseInput
): Promise<ManualExpense> {
  validateInput(input);

  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses")
    .update(toRow(input))
    .eq("id", id)
    .select(SELECT_FIELDS)
    .single();

  if (error) throw new Error(error.message);

  return mapExpense(data as unknown as ManualExpenseRow);
}

export async function deleteManualExpense(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}