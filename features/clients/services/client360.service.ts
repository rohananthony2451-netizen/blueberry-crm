import { createClient } from "@/lib/supabase/client";

import type { Client } from "../types";
import type { Event } from "@/features/events/types";
import type {
  Quotation,
  QuotationItem,
  QuotationStatus,
} from "@/features/quotations/types";
import type {
  Payment,
  PaymentMethod,
} from "@/features/payments/types";

interface ClientRow {
  id: string;
  organization_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface EventRow {
  id: string;
  organization_id: string;
  client_id: string | null;
  client_name: string;
  event_name: string;
  event_type: string;
  event_date: string;
  venue: string;
  status: Event["status"];
  guest_count: number;
  created_at: string;
  updated_at: string;
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

  prospect_name: string;
  prospect_phone: string;
  prospect_email: string | null;
  prospect_address: string | null;

  event_name: string;
  event_type: string;
  event_date: string;
  venue: string;
  guest_count: number | string;

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

  events: {
    event_name: string;
  } | null;

  quotation_items: QuotationItemRow[];
}

interface PaymentRow {
  id: string;
  organization_id: string;
  client_id: string;
  event_id: string | null;
  quotation_id: string | null;
  payment_number: string;
  payment_date: string;
  amount: number | string;
  payment_method: string;
  reference_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;

  events: {
    event_name: string;
  } | null;

  quotations: {
    quotation_number: string;
  } | null;
}

export interface Client360Summary {
  totalQuoted: number;
  totalReceived: number;
  remaining: number;
  overpaid: number;
  unallocated: number;
  eventCount: number;
  quotationCount: number;
  paymentCount: number;
}

export interface Client360Data {
  client: Client;
  events: Event[];
  quotations: Quotation[];
  payments: Payment[];
  summary: Client360Summary;
}

function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? "",
    email: row.email ?? "",
    address: row.address ?? "",
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEvent(row: EventRow): Event {
  return {
    id: row.id,
    clientId: row.client_id,
    clientName: row.client_name,
    eventName: row.event_name,
    eventType: row.event_type,
    eventDate: row.event_date,
    venue: row.venue,
    status: row.status,
    guestCount: row.guest_count,
  };
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
    clientName: "",

    eventId: row.event_id,
    eventName:
      row.events?.event_name ?? null,

    leadId: row.lead_id,

    prospectName: row.prospect_name,
    prospectPhone: row.prospect_phone,
    prospectEmail: row.prospect_email ?? "",
    prospectAddress:
      row.prospect_address ?? "",

    proposedEventName: row.event_name,
    proposedEventType: row.event_type,
    proposedEventDate: row.event_date,
    proposedVenue: row.venue,
    proposedGuestCount:
      Number(row.guest_count),

    quotationDate: row.quotation_date,
    validUntil: row.valid_until,

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

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPayment(
  row: PaymentRow
): Payment {
  return {
    id: row.id,
    organizationId: row.organization_id,
    clientId: row.client_id,
    clientName: "",
    eventId: row.event_id,
    eventName: row.events?.event_name ?? null,
    quotationId: row.quotation_id,
    quotationNumber:
      row.quotations?.quotation_number ?? null,
    paymentNumber: row.payment_number,
    paymentDate: row.payment_date,
    amount: Number(row.amount),
    paymentMethod:
      row.payment_method as PaymentMethod,
    referenceNumber:
      row.reference_number ?? "",
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getClient360(
  clientId: string
): Promise<Client360Data> {
  const supabase = createClient();

  const {
    data: clientData,
    error: clientError,
  } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (clientError) {
    throw new Error(clientError.message);
  }

  const [
    eventsResult,
    quotationsResult,
    paymentsResult,
  ] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("client_id", clientId)
      .order("event_date", {
        ascending: true,
      }),

    supabase
      .from("quotations")
      .select(`
        *,
        events (
          event_name
        ),
        quotation_items (
          *
        )
      `)
      .eq("client_id", clientId)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("payments")
      .select(`
        *,
        events (
          event_name
        ),
        quotations (
          quotation_number
        )
      `)
      .eq("client_id", clientId)
      .order("payment_date", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      }),
  ]);

  if (eventsResult.error) {
    throw new Error(
      eventsResult.error.message
    );
  }

  if (quotationsResult.error) {
    throw new Error(
      quotationsResult.error.message
    );
  }

  if (paymentsResult.error) {
    throw new Error(
      paymentsResult.error.message
    );
  }

  const events =
    (eventsResult.data ?? []) as EventRow[];

  const quotations =
    (quotationsResult.data ?? []) as QuotationRow[];

  const payments =
    (paymentsResult.data ?? []) as PaymentRow[];

  const mappedEvents =
    events.map(mapEvent);

  const mappedQuotations =
    quotations.map((quotation) => ({
      ...mapQuotation(quotation),
      clientName: clientData.name,
    }));

  const mappedPayments =
    payments.map((payment) => ({
      ...mapPayment(payment),
      clientName: clientData.name,
    }));

  /*
   * Only Sent and Accepted quotations are
   * financially active.
   */
  const activeQuotations =
    mappedQuotations.filter(
      (quotation) =>
        quotation.status === "Sent" ||
        quotation.status === "Accepted"
    );

  const activeQuotationIds =
    new Set(
      activeQuotations.map(
        (quotation) => quotation.id
      )
    );

  /*
   * Calculate money at quotation level.
   *
   * This is important when a client has
   * multiple quotations.
   *
   * Example:
   *
   * Quotation A = ₹1,00,000
   * Paid         = ₹1,20,000
   *
   * Quotation B = ₹1,00,000
   * Paid         = ₹0
   *
   * Result:
   * Remaining = ₹1,00,000
   * Overpaid  = ₹20,000
   *
   * We do NOT net these against each other.
   */
  const paymentsByQuotation =
    new Map<string, number>();

  let unallocated = 0;

  for (const payment of mappedPayments) {
    if (
      !payment.quotationId ||
      !activeQuotationIds.has(
        payment.quotationId
      )
    ) {
      unallocated += payment.amount;
      continue;
    }

    const current =
      paymentsByQuotation.get(
        payment.quotationId
      ) ?? 0;

    paymentsByQuotation.set(
      payment.quotationId,
      current + payment.amount
    );
  }

  const totalQuoted =
    activeQuotations.reduce(
      (sum, quotation) =>
        sum + quotation.total,
      0
    );

  let totalReceived = 0;
  let remaining = 0;
  let overpaid = 0;

  for (const quotation of activeQuotations) {
    const received =
      paymentsByQuotation.get(
        quotation.id
      ) ?? 0;

    totalReceived += received;

    remaining += Math.max(
      quotation.total - received,
      0
    );

    overpaid += Math.max(
      received - quotation.total,
      0
    );
  }

  return {
    client: mapClient(
      clientData as ClientRow
    ),

    events: mappedEvents,

    quotations: mappedQuotations,

    payments: mappedPayments,

    summary: {
      totalQuoted,
      totalReceived,
      remaining,
      overpaid,
      unallocated,
      eventCount: mappedEvents.length,
      quotationCount:
        mappedQuotations.length,
      paymentCount:
        mappedPayments.length,
    },
  };
}