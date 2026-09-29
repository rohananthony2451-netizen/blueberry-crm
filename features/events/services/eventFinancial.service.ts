
import { createClient } from "@/lib/supabase/browser";

export interface EventFinancialSummary {
  quotationCount: number;
  quotationTotal: number;
  paymentsReceived: number;
  customerBalance: number;
  obligationCount: number;
  obligationsTotal: number;
  obligationsPaid: number;
  obligationsRemaining: number;
}

export async function getEventFinancialSummary(
  eventId: string
): Promise<EventFinancialSummary> {
  const supabase = createClient();

  const {
    data: organizationId,
    error: organizationError,
  } = await supabase.rpc("get_user_organization_id");

  if (organizationError) {
    throw new Error(organizationError.message);
  }

  if (!organizationId) {
    throw new Error(
      "No organization found for the current user."
    );
  }

  // Only accepted quotations linked to this confirmed event.
  const {
    data: quotations,
    error: quotationError,
  } = await supabase
    .from("quotations")
    .select("id, total")
    .eq("organization_id", organizationId)
    .eq("event_id", eventId)
    .eq("status", "Accepted");

  if (quotationError) {
    throw new Error(quotationError.message);
  }

  const quotationRows = quotations ?? [];
  const quotationIds = quotationRows.map(
    (quotation) => quotation.id as string
  );

  const quotationTotal = quotationRows.reduce(
    (sum, quotation) =>
      sum + Number(quotation.total ?? 0),
    0
  );

  let paymentsReceived = 0;

  // First count payments directly linked to this event.
  const {
    data: eventPayments,
    error: eventPaymentsError,
  } = await supabase
    .from("payments")
    .select("amount")
    .eq("organization_id", organizationId)
    .eq("event_id", eventId);

  if (eventPaymentsError) {
    throw new Error(eventPaymentsError.message);
  }

  paymentsReceived += (eventPayments ?? []).reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0
  );

  // Also count payments linked to this event's quotations
  // when their event_id is empty. This avoids counting any
  // payment twice.
  if (quotationIds.length > 0) {
    const {
      data: quotationPayments,
      error: quotationPaymentsError,
    } = await supabase
      .from("payments")
      .select("amount")
      .eq("organization_id", organizationId)
      .is("event_id", null)
      .in("quotation_id", quotationIds);

    if (quotationPaymentsError) {
      throw new Error(quotationPaymentsError.message);
    }

    paymentsReceived += (
      quotationPayments ?? []
    ).reduce(
      (sum, payment) =>
        sum + Number(payment.amount ?? 0),
      0
    );
  }

  // Obligations are already connected to the event by ID.
  const {
    data: obligations,
    error: obligationsError,
  } = await supabase
    .from("event_cost_obligations")
    .select("amount, paid")
    .eq("organization_id", organizationId)
    .eq("event_id", eventId);

  if (obligationsError) {
    throw new Error(obligationsError.message);
  }

  const obligationRows = obligations ?? [];

  const obligationsTotal = obligationRows.reduce(
    (sum, item) => sum + Number(item.amount ?? 0),
    0
  );

  const obligationsPaid = obligationRows.reduce(
    (sum, item) => sum + Number(item.paid ?? 0),
    0
  );

  return {
    quotationCount: quotationRows.length,
    quotationTotal,
    paymentsReceived,
    customerBalance: Math.max(
      0,
      quotationTotal - paymentsReceived
    ),
    obligationCount: obligationRows.length,
    obligationsTotal,
    obligationsPaid,
    obligationsRemaining: Math.max(
      0,
      obligationsTotal - obligationsPaid
    ),
  };
}