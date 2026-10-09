import { createClient } from "@/lib/supabase/client";
import type {
  VendorEntry,
  VendorEntryFormValues,
  VendorEntryStatus,
} from "../types";

interface VendorEntryRow {
  id: string;
  organization_id: string;
  event_id: string;
  vendor_id: string;
  category: string;
  amount: number | string;
  entry_date: string;
  status: VendorEntryStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  events: { event_name: string } | null;
  vendors: { name: string } | null;
}

const ENTRY_SELECT = `
  *,
  events (event_name),
  vendors (name)
`;

function mapEntry(row: VendorEntryRow): VendorEntry {
  return {
    id: row.id,
    organizationId: row.organization_id,
    eventId: row.event_id,
    eventName: row.events?.event_name ?? "Unknown event",
    vendorId: row.vendor_id,
    vendorName: row.vendors?.name ?? "Unknown vendor",
    category: row.category,
    amount: Number(row.amount),
    entryDate: row.entry_date,
    status: row.status,
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDatabase(values: VendorEntryFormValues) {
  return {
    event_id: values.eventId,
    vendor_id: values.vendorId,
    category: values.category.trim(),
    amount: Number(values.amount),
    entry_date: values.entryDate,
    status: values.status,
    notes: values.notes.trim() || null,
  };
}

function validateEntry(values: VendorEntryFormValues) {
  if (!values.eventId) throw new Error("Select an event.");
  if (!values.vendorId) throw new Error("Select a vendor.");
  if (!values.category.trim()) throw new Error("Select a category.");
  if (!Number.isFinite(Number(values.amount)) || Number(values.amount) < 0) {
    throw new Error("Amount must be zero or greater.");
  }
  if (!values.entryDate) throw new Error("Select a date.");
  if (!["Pending", "Confirmed", "Paid", "Cancelled"].includes(values.status)) {
    throw new Error("Select a valid status.");
  }
}

export async function getVendorEntries(): Promise<VendorEntry[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("vendor_entries")
    .select(ENTRY_SELECT)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as VendorEntryRow[]).map(mapEntry);
}

export async function createVendorEntry(
  values: VendorEntryFormValues
): Promise<VendorEntry> {
  validateEntry(values);

  const supabase = createClient();
  const { data: organizationId, error: organizationError } =
    await supabase.rpc("get_user_organization_id");

  if (organizationError) throw new Error(organizationError.message);
  if (!organizationId) throw new Error("No workspace found for the current user.");

  const { data, error } = await supabase
    .from("vendor_entries")
    .insert({
      organization_id: organizationId,
      ...toDatabase(values),
    })
    .select(ENTRY_SELECT)
    .single();

  if (error) throw new Error(error.message);

  return mapEntry(data as unknown as VendorEntryRow);
}

export async function updateVendorEntry(
  id: string,
  values: VendorEntryFormValues
): Promise<VendorEntry> {
  validateEntry(values);

  const supabase = createClient();
  const { data, error } = await supabase
    .from("vendor_entries")
    .update(toDatabase(values))
    .eq("id", id)
    .select(ENTRY_SELECT)
    .single();

  if (error) throw new Error(error.message);

  return mapEntry(data as unknown as VendorEntryRow);
}

export async function deleteVendorEntry(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("vendor_entries")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}