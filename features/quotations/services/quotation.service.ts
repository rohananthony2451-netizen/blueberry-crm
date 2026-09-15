import { createClient } from "@/lib/supabase/client";

import {
  Quotation,
  QuotationItem,
  QuotationStatus,
} from "../types";

interface QuotationItemRow {
  id: string;
  quotation_id: string;
  description: string;
  quantity: number | string;
  unit_price: number | string;
  amount: number | string;
  created_at: string;
}

interface QuotationRow {
  id: string;
  organization_id: string;
  quotation_number: string;
  client_id: string;
  event_id: string | null;
  quotation_date: string;
  valid_until: string | null;
  status: string;
  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  total: number | string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  quotation_items: QuotationItemRow[];
}

function mapQuotationItem(
  row: QuotationItemRow
): QuotationItem {
  return {
    id: row.id,
    quotationId: row.quotation_id,
    description: row.description,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    amount: Number(row.amount),
    createdAt: row.created_at,
  };
}

function mapQuotation(
  row: QuotationRow
): Quotation {
  return {
    id: row.id,
    organizationId: row.organization_id,

    quotationNumber:
      row.quotation_number,

    clientId: row.client_id,
    eventId: row.event_id,

    quotationDate:
      row.quotation_date,

    validUntil:
      row.valid_until,

    status:
      row.status as QuotationStatus,

    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    tax: Number(row.tax),
    total: Number(row.total),

    notes: row.notes ?? "",

    items: (
      row.quotation_items ?? []
    ).map(mapQuotationItem),

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

export async function getQuotations(): Promise<
  Quotation[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("quotations")
    .select(`
      *,
      quotation_items (*)
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as QuotationRow[]).map(
    mapQuotation
  );
}