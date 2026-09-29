
import { createClient } from "@/lib/supabase/browser";

import type {
  EventCostObligation,
  UpdateEventCostObligationInput,
} from "../types";

interface EventCostObligationRow {
  id: string;
  organization_id: string;
  event_id: string;
  quotation_id: string;
  quotation_item_id: string;
  description: string;
  amount: number | string;
  paid: number | string;
  owed_to: string | null;
  created_at: string;
  updated_at: string;

  events: {
    event_name: string;
    event_date: string;
    client_name: string;
  } | null;

  quotations: {
    quotation_number: string;
  } | null;
}

const OBLIGATION_SELECT = `
  *,
  events (
    event_name,
    event_date,
    client_name
  ),
  quotations (
    quotation_number
  )
`;

function mapObligation(
  row: EventCostObligationRow
): EventCostObligation {
  const amount = Number(row.amount);
  const paid = Number(row.paid);

  return {
    id: row.id,
    organizationId: row.organization_id,

    eventId: row.event_id,
    eventName:
      row.events?.event_name ?? "Unknown Event",
    eventDate: row.events?.event_date ?? "",
    clientName:
      row.events?.client_name ?? "Unknown Client",

    quotationId: row.quotation_id,
    quotationNumber:
      row.quotations?.quotation_number ?? "",

    quotationItemId: row.quotation_item_id,
    description: row.description,

    amount,
    paid,
    remaining: Math.max(0, amount - paid),

    owedTo: row.owed_to ?? "",

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getEventCostObligations(): Promise<
  EventCostObligation[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("event_cost_obligations")
    .select(OBLIGATION_SELECT)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (
    data as unknown as EventCostObligationRow[]
  ).map(mapObligation);
}

export async function updateEventCostObligation(
  id: string,
  input: UpdateEventCostObligationInput
): Promise<EventCostObligation> {
  const amount = Number(input.amount);
  const paid = Number(input.paid);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error(
      "Amount owed must be zero or greater."
    );
  }

  if (!Number.isFinite(paid) || paid < 0) {
    throw new Error(
      "Amount paid must be zero or greater."
    );
  }

  if (paid > amount) {
    throw new Error(
      "Amount paid cannot exceed the amount owed."
    );
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("event_cost_obligations")
    .update({
      amount,
      paid,
      owed_to: input.owedTo.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(OBLIGATION_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapObligation(
    data as unknown as EventCostObligationRow
  );
}