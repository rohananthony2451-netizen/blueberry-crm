import { createClient } from "@/lib/supabase/client";

import {
  Quotation,
  QuotationItem,
  QuotationStatus,
} from "../types";

export interface QuotationInput {
  clientId: string;
  leadId: string;

  prospectName: string;
  prospectPhone: string;
  prospectEmail: string;
  prospectAddress: string;

  eventName: string;
  eventType: string;
  eventDate: string;
  venue: string;
  guestCount: number;

  quotationDate: string;
  validUntil: string | null;

  discount: number;
  tax: number;
  notes: string;

  items: {
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
}

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

  client_id: string | null;
  event_id: string | null;
  lead_id: string | null;

  prospect_name: string | null;
  prospect_phone: string | null;
  prospect_email: string | null;
  prospect_address: string | null;

  event_name: string | null;
  event_type: string | null;
  event_date: string | null;
  venue: string | null;
  guest_count: number | string | null;

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

  clients: {
    name: string;
  } | null;

  events: {
    event_name: string;
  } | null;

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
    quotationNumber: row.quotation_number,

    clientId: row.client_id,

    clientName:
      row.clients?.name ??
      row.prospect_name ??
      "Unknown Prospect",

    eventId: row.event_id,

    eventName:
      row.events?.event_name ??
      row.event_name ??
      null,

    leadId: row.lead_id,

    prospectName:
      row.prospect_name ?? "",

    prospectPhone:
      row.prospect_phone ?? "",

    prospectEmail:
      row.prospect_email ?? "",

    prospectAddress:
      row.prospect_address ?? "",

    proposedEventName:
      row.event_name ?? "",

    proposedEventType:
      row.event_type ?? "",

    proposedEventDate:
      row.event_date ?? "",

    proposedVenue:
      row.venue ?? "",

    proposedGuestCount:
      Number(row.guest_count ?? 0),

    quotationDate:
      row.quotation_date,

    validUntil:
      row.valid_until,

    status:
      row.status as QuotationStatus,

    subtotal:
      Number(row.subtotal),

    discount:
      Number(row.discount),

    tax:
      Number(row.tax),

    total:
      Number(row.total),

    notes:
      row.notes ?? "",

    items:
      (row.quotation_items ?? []).map(
        mapQuotationItem
      ),

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

async function validateQuotationRelationships(
  quotation: QuotationInput
): Promise<void> {
  const supabase = createClient();

  /*
   * A quotation may be created:
   *
   * 1. For an existing Client
   * 2. For a Lead
   * 3. For a walk-in prospect
   *
   * Therefore clientId and leadId are both optional
   * at the database/application relationship level.
   */

  if (quotation.clientId) {
    const {
      data: client,
      error: clientError,
    } = await supabase
      .from("clients")
      .select("id")
      .eq("id", quotation.clientId)
      .single();

    if (clientError || !client) {
      throw new Error(
        "The selected client could not be found."
      );
    }
  }

  if (quotation.leadId) {
    const {
      data: lead,
      error: leadError,
    } = await supabase
      .from("leads")
      .select("id")
      .eq("id", quotation.leadId)
      .single();

    if (leadError || !lead) {
      throw new Error(
        "The selected lead could not be found."
      );
    }
  }
}

async function getQuotationById(
  id: string
): Promise<Quotation> {
  const supabase = createClient();

  const {
    data,
    error,
  } = await supabase
    .from("quotations")
    .select(`
      *,
      clients (
        name
      ),
      events (
        event_name
      ),
      quotation_items (
        *
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapQuotation(
    data as QuotationRow
  );
}

export async function getQuotations(): Promise<
  Quotation[]
> {
  const supabase = createClient();

  const {
    data,
    error,
  } = await supabase
    .from("quotations")
    .select(`
      *,
      clients (
        name
      ),
      events (
        event_name
      ),
      quotation_items (
        *
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (
    data as QuotationRow[]
  ).map(mapQuotation);
}

export async function createQuotation(
  quotation: QuotationInput
): Promise<Quotation> {
  const supabase = createClient();

  const {
    data: organizationId,
    error: organizationError,
  } = await supabase.rpc(
    "get_user_organization_id"
  );

  if (organizationError) {
    throw new Error(
      organizationError.message
    );
  }

  if (!organizationId) {
    throw new Error(
      "No organization found for the current user."
    );
  }

  await validateQuotationRelationships(
    quotation
  );

  const {
    data: quotationNumber,
    error: quotationNumberError,
  } = await supabase.rpc(
    "generate_quotation_number"
  );

  if (quotationNumberError) {
    throw new Error(
      quotationNumberError.message
    );
  }

  if (!quotationNumber) {
    throw new Error(
      "Failed to generate quotation number."
    );
  }

  const subtotal =
    quotation.items.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const total =
    subtotal -
    quotation.discount +
    quotation.tax;

  if (total < 0) {
    throw new Error(
      "Quotation total cannot be negative."
    );
  }

  const {
    data: quotationData,
    error: quotationError,
  } = await supabase
    .from("quotations")
    .insert({
      organization_id:
        organizationId,

      quotation_number:
        quotationNumber,

      client_id:
        quotation.clientId || null,

      lead_id:
        quotation.leadId || null,

      prospect_name:
        quotation.prospectName,

      prospect_phone:
        quotation.prospectPhone || null,

      prospect_email:
        quotation.prospectEmail || null,

      prospect_address:
        quotation.prospectAddress || null,

      event_name:
        quotation.eventName,

      event_type:
        quotation.eventType,

      event_date:
        quotation.eventDate,

      venue:
        quotation.venue,

      guest_count:
        quotation.guestCount,

      quotation_date:
        quotation.quotationDate,

      valid_until:
        quotation.validUntil || null,

      status:
        "Draft",

      subtotal,

      discount:
        quotation.discount,

      tax:
        quotation.tax,

      total,

      notes:
        quotation.notes || null,
    })
    .select("id")
    .single();

  if (quotationError) {
    throw new Error(
      quotationError.message
    );
  }

  const quotationId =
    quotationData.id;

  const items =
    quotation.items.map(
      (item) => ({
        quotation_id:
          quotationId,

        description:
          item.description,

        quantity:
          item.quantity,

        unit_price:
          item.unitPrice,

        amount:
          item.amount,
      })
    );

  const {
    error: itemsError,
  } = await supabase
    .from("quotation_items")
    .insert(items);

  if (itemsError) {
    await supabase
      .from("quotations")
      .delete()
      .eq("id", quotationId);

    throw new Error(
      itemsError.message
    );
  }

  return getQuotationById(
    quotationId
  );
}

export async function updateQuotation(
  id: string,
  quotation: QuotationInput
): Promise<Quotation> {
  const supabase = createClient();

  const existingQuotation =
    await getQuotationById(id);

  /*
   * Once a quotation is accepted,
   * Client + Event have been confirmed.
   *
   * Do not allow editing the quotation
   * through the prospect form afterward.
   */
  if (
    existingQuotation.status ===
    "Accepted"
  ) {
    throw new Error(
      "Accepted quotations cannot be edited."
    );
  }

  await validateQuotationRelationships(
    quotation
  );

  const subtotal =
    quotation.items.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

  const total =
    subtotal -
    quotation.discount +
    quotation.tax;

  if (total < 0) {
    throw new Error(
      "Quotation total cannot be negative."
    );
  }

  const {
    error: quotationError,
  } = await supabase
    .from("quotations")
    .update({
      client_id:
        quotation.clientId || null,

      lead_id:
        quotation.leadId || null,

      prospect_name:
        quotation.prospectName,

      prospect_phone:
        quotation.prospectPhone || null,

      prospect_email:
        quotation.prospectEmail || null,

      prospect_address:
        quotation.prospectAddress || null,

      event_name:
        quotation.eventName,

      event_type:
        quotation.eventType,

      event_date:
        quotation.eventDate,

      venue:
        quotation.venue,

      guest_count:
        quotation.guestCount,

      quotation_date:
        quotation.quotationDate,

      valid_until:
        quotation.validUntil || null,

      subtotal,

      discount:
        quotation.discount,

      tax:
        quotation.tax,

      total,

      notes:
        quotation.notes || null,
    })
    .eq("id", id);

  if (quotationError) {
    throw new Error(
      quotationError.message
    );
  }

  /*
   * Keep existing quotation item IDs
   * whenever possible.
   */

  const existingItemIds =
    existingQuotation.items.map(
      (item) => item.id
    );

  const submittedExistingItemIds =
    quotation.items
      .filter((item) => item.id)
      .map(
        (item) =>
          item.id as string
      );

  const removedItemIds =
    existingItemIds.filter(
      (existingId) =>
        !submittedExistingItemIds.includes(
          existingId
        )
    );

  if (
    removedItemIds.length > 0
  ) {
    const {
      error: deleteError,
    } = await supabase
      .from("quotation_items")
      .delete()
      .eq("quotation_id", id)
      .in(
        "id",
        removedItemIds
      );

    if (deleteError) {
      throw new Error(
        deleteError.message
      );
    }
  }

  for (
    const item of quotation.items
  ) {
    if (item.id) {
      const {
        error: updateItemError,
      } = await supabase
        .from("quotation_items")
        .update({
          description:
            item.description,

          quantity:
            item.quantity,

          unit_price:
            item.unitPrice,

          amount:
            item.amount,
        })
        .eq("id", item.id)
        .eq(
          "quotation_id",
          id
        );

      if (updateItemError) {
        throw new Error(
          updateItemError.message
        );
      }
    } else {
      const {
        error: insertItemError,
      } = await supabase
        .from("quotation_items")
        .insert({
          quotation_id:
            id,

          description:
            item.description,

          quantity:
            item.quantity,

          unit_price:
            item.unitPrice,

          amount:
            item.amount,
        });

      if (insertItemError) {
        throw new Error(
          insertItemError.message
        );
      }
    }
  }

  return getQuotationById(id);
}

/**
 * Accepts a quotation through the
 * atomic database workflow.
 *
 * This is intentionally NOT a normal
 * status update.
 *
 * The database function:
 * - validates the quotation
 * - resolves/reuses the Client
 * - creates the confirmed Event
 * - links the quotation
 * - marks the quotation Accepted
 */
export async function acceptQuotation(
  id: string
): Promise<Quotation> {
  const supabase = createClient();

  const {
    error,
  } = await supabase.rpc(
    "accept_quotation",
    {
      p_quotation_id: id,
    }
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  return getQuotationById(id);
}

/**
 * Updates the quotation lifecycle.
 *
 * Allowed transitions:
 *
 * Draft -> Sent
 * Sent -> Accepted
 * Sent -> Rejected
 *
 * Accepted is handled by
 * acceptQuotation() because acceptance
 * creates the confirmed Client/Event.
 */
export async function updateQuotationStatus(
  id: string,
  nextStatus: QuotationStatus
): Promise<Quotation> {
  const supabase = createClient();

  if (
    nextStatus === "Accepted"
  ) {
    return acceptQuotation(id);
  }

  const currentQuotation =
    await getQuotationById(id);

  const currentStatus =
    currentQuotation.status;

  const allowedTransitions: Record<
    QuotationStatus,
    QuotationStatus[]
  > = {
    Draft: ["Sent"],

    Sent: [
      "Rejected",
    ],

    Accepted: [],

    Rejected: [],
  };

  const allowedNextStatuses =
    allowedTransitions[
      currentStatus
    ];

  if (
    !allowedNextStatuses.includes(
      nextStatus
    )
  ) {
    throw new Error(
      `Quotation cannot move from ${currentStatus} to ${nextStatus}.`
    );
  }

  const {
    error,
  } = await supabase
    .from("quotations")
    .update({
      status:
        nextStatus,
    })
    .eq("id", id)
    .eq(
      "status",
      currentStatus
    );

  if (error) {
    throw new Error(
      error.message
    );
  }

  return getQuotationById(id);
}

export async function deleteQuotation(
  id: string
): Promise<void> {
  const supabase = createClient();

  const {
    error,
  } = await supabase
    .from("quotations")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }
}