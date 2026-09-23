import { createClient } from "@/lib/supabase/client";

import type {
  Payment,
  PaymentMethod,
  PendingPaymentItem,
  QuotationPaymentSummary,
} from "../types";

export interface PaymentInput {
  clientId: string;
  eventId: string | null;
  quotationId: string | null;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  notes: string;
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

  clients: {
    name: string;
  } | null;

  events: {
    event_name: string;
  } | null;

  quotations: {
    quotation_number: string;
  } | null;
}

interface PaymentFinancialRow {
  id: string;
  amount: number | string;
  quotation_id: string | null;
}

interface FinancialQuotationRow {
  id: string;
  organization_id: string;
  quotation_number: string;
  client_id: string;
  event_id: string | null;
  status: string;
  total: number | string;

clients: {
  name: string;
}[] | null;

events: {
  event_name: string;
}[] | null;
}

function mapPayment(
  row: PaymentRow
): Payment {
  return {
    id: row.id,

    organizationId:
      row.organization_id,

    clientId:
      row.client_id,

    clientName:
  row.clients?.name ??
  "Unknown Client",

    eventId:
      row.event_id,

   eventName:
  row.events?.event_name ??
  null,

    quotationId:
      row.quotation_id,

    quotationNumber:
      row.quotations
        ?.quotation_number ??
      null,

    paymentNumber:
      row.payment_number,

    paymentDate:
      row.payment_date,

    amount:
      Number(row.amount),

    paymentMethod:
      row.payment_method as PaymentMethod,

    referenceNumber:
      row.reference_number ??
      "",

    notes:
      row.notes ?? "",

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

async function getOrganizationId(): Promise<string> {
  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_user_organization_id"
  );

  if (error) {
    throw new Error(
      error.message
    );
  }

  if (!data) {
    throw new Error(
      "No organization found for the current user."
    );
  }

  return data;
}

async function getPaymentById(
  id: string
): Promise<Payment> {
  const supabase =
    createClient();

  const organizationId =
    await getOrganizationId();

  const {
    data,
    error,
  } = await supabase
    .from("payments")
    .select(`
      *,
      clients ( name ),
      events ( event_name ),
      quotations ( quotation_number )
    `)
    .eq("id", id)
    .eq(
      "organization_id",
      organizationId
    )
    .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return mapPayment(
    data as PaymentRow
  );
}

export async function getPayments(): Promise<
  Payment[]
> {
  const supabase =
    createClient();

  const organizationId =
    await getOrganizationId();

  const {
    data,
    error,
  } = await supabase
    .from("payments")
    .select(`
      *,
      clients ( name ),
      events ( event_name ),
      quotations ( quotation_number )
    `)
    .eq(
      "organization_id",
      organizationId
    )
    .order(
      "payment_date",
      {
        ascending: false,
      }
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    throw new Error(
      error.message
    );
  }

  return (
    data as PaymentRow[]
  ).map(mapPayment);
}

async function validatePaymentRelationships(
  payment: PaymentInput
): Promise<void> {
  const supabase =
    createClient();

  const organizationId =
    await getOrganizationId();

  const {
    data: client,
    error: clientError,
  } = await supabase
    .from("clients")
    .select("id")
    .eq(
      "id",
      payment.clientId
    )
    .eq(
      "organization_id",
      organizationId
    )
    .single();

  if (
    clientError ||
    !client
  ) {
    throw new Error(
      "The selected client could not be found."
    );
  }

  if (payment.eventId) {
    const {
      data: event,
      error: eventError,
    } = await supabase
      .from("events")
      .select(
        "id, client_id"
      )
      .eq(
        "id",
        payment.eventId
      )
      .eq(
        "organization_id",
        organizationId
      )
      .single();

    if (
      eventError ||
      !event
    ) {
      throw new Error(
        "The selected event could not be found."
      );
    }

    if (
      event.client_id !==
      payment.clientId
    ) {
      throw new Error(
        "The selected event does not belong to the selected client."
      );
    }
  }

  if (payment.quotationId) {
    const {
      data: quotation,
      error: quotationError,
    } = await supabase
      .from("quotations")
      .select(
        "id, client_id, event_id"
      )
      .eq(
        "id",
        payment.quotationId
      )
      .eq(
        "organization_id",
        organizationId
      )
      .single();

    if (
      quotationError ||
      !quotation
    ) {
      throw new Error(
        "The selected quotation could not be found."
      );
    }

    if (
      quotation.client_id !==
      payment.clientId
    ) {
      throw new Error(
        "The selected quotation does not belong to the selected client."
      );
    }

    if (
      quotation.event_id &&
      payment.eventId !==
        quotation.event_id
    ) {
      throw new Error(
        "The selected event does not match the quotation event."
      );
    }
  }
}

export async function createPayment(
  payment: PaymentInput
): Promise<Payment> {
  const supabase =
    createClient();

  const organizationId =
    await getOrganizationId();

  if (payment.amount <= 0) {
    throw new Error(
      "Payment amount must be greater than 0."
    );
  }

  await validatePaymentRelationships(
    payment
  );

  const {
    data: paymentNumber,
    error: paymentNumberError,
  } = await supabase.rpc(
    "generate_payment_number"
  );

  if (paymentNumberError) {
    throw new Error(
      paymentNumberError.message
    );
  }

  if (!paymentNumber) {
    throw new Error(
      "Failed to generate payment number."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("payments")
    .insert({
      organization_id:
        organizationId,

      client_id:
        payment.clientId,

      event_id:
        payment.eventId ||
        null,

      quotation_id:
        payment.quotationId ||
        null,

      payment_number:
        paymentNumber,

      payment_date:
        payment.paymentDate,

      amount:
        payment.amount,

      payment_method:
        payment.paymentMethod,

      reference_number:
        payment.referenceNumber ||
        null,

      notes:
        payment.notes ||
        null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return getPaymentById(
    data.id
  );
}

export async function updatePayment(
  id: string,
  payment: PaymentInput
): Promise<Payment> {
  const supabase =
    createClient();

  const organizationId =
    await getOrganizationId();

  if (payment.amount <= 0) {
    throw new Error(
      "Payment amount must be greater than 0."
    );
  }

  await validatePaymentRelationships(
    payment
  );

  const {
    data,
    error,
  } = await supabase
    .from("payments")
    .update({
      client_id:
        payment.clientId,

      event_id:
        payment.eventId ||
        null,

      quotation_id:
        payment.quotationId ||
        null,

      payment_date:
        payment.paymentDate,

      amount:
        payment.amount,

      payment_method:
        payment.paymentMethod,

      reference_number:
        payment.referenceNumber ||
        null,

      notes:
        payment.notes ||
        null,
    })
    .eq("id", id)
    .eq(
      "organization_id",
      organizationId
    )
    .select("id")
    .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return getPaymentById(
    data.id
  );
}

export async function deletePayment(
  id: string
): Promise<void> {
  const supabase =
    createClient();

  const organizationId =
    await getOrganizationId();

  const {
    error,
  } = await supabase
    .from("payments")
    .delete()
    .eq("id", id)
    .eq(
      "organization_id",
      organizationId
    );

  if (error) {
    throw new Error(
      error.message
    );
  }
}

export async function getQuotationPaymentSummary(
  quotationId: string,
  excludePaymentId?: string
): Promise<QuotationPaymentSummary | null> {
  const supabase =
    createClient();

  const organizationId =
    await getOrganizationId();

  const {
    data: quotation,
    error: quotationError,
  } = await supabase
    .from("quotations")
    .select(`
      id,
      organization_id,
      quotation_number,
      client_id,
      event_id,
      status,
      total,
      clients ( name ),
      events ( event_name )
    `)
    .eq("id", quotationId)
    .eq(
      "organization_id",
      organizationId
    )
    .single();

  if (quotationError) {
    throw new Error(
      quotationError.message
    );
  }

  if (!quotation) {
    return null;
  }

  if (
    quotation.status !==
      "Sent" &&
    quotation.status !==
      "Accepted"
  ) {
    return null;
  }

  let paymentQuery =
    supabase
      .from("payments")
      .select(
        "id, amount, quotation_id"
      )
      .eq(
        "quotation_id",
        quotationId
      )
      .eq(
        "organization_id",
        organizationId
      );

  if (excludePaymentId) {
    paymentQuery =
      paymentQuery.neq(
        "id",
        excludePaymentId
      );
  }

  const {
    data: payments,
    error: paymentsError,
  } = await paymentQuery;

  if (paymentsError) {
    throw new Error(
      paymentsError.message
    );
  }

  const receivedAmount =
    (
      (payments ??
        []) as PaymentFinancialRow[]
    ).reduce(
      (sum, payment) =>
        sum +
        Number(payment.amount),
      0
    );

  const quotationTotal =
    Number(quotation.total);

  const remainingAmount =
    Math.max(
      quotationTotal -
        receivedAmount,
      0
    );

  const overpaidAmount =
    Math.max(
      receivedAmount -
        quotationTotal,
      0
    );

  return {
    quotationId:
      quotation.id,

    quotationNumber:
      quotation.quotation_number,

    clientId:
      quotation.client_id,

    clientName:
  quotation.clients?.[0]?.name ??
  "Unknown Client",

    eventId:
      quotation.event_id,

    eventName:
  quotation.events?.[0]?.event_name ??
  null,

    quotationTotal,

    receivedAmount,

    remainingAmount,

    overpaidAmount,

    status:
      quotation.status as
        | "Sent"
        | "Accepted",
  };
}

export async function getPendingPayments(): Promise<
  PendingPaymentItem[]
> {
  const supabase =
    createClient();

  const organizationId =
    await getOrganizationId();

  const {
    data: quotations,
    error: quotationsError,
  } = await supabase
    .from("quotations")
    .select(`
      id,
      organization_id,
      quotation_number,
      client_id,
      event_id,
      status,
      total,
      clients ( name ),
      events ( event_name )
    `)
    .eq(
      "organization_id",
      organizationId
    )
    .in(
      "status",
      ["Sent", "Accepted"]
    )
    .order(
      "quotation_date",
      {
        ascending: true,
      }
    );

  if (quotationsError) {
    throw new Error(
      quotationsError.message
    );
  }

  const quotationRows =
    (quotations ??
      []) as FinancialQuotationRow[];

  if (
    quotationRows.length === 0
  ) {
    return [];
  }

  const quotationIds =
    quotationRows.map(
      (quotation) =>
        quotation.id
    );

  const {
    data: payments,
    error: paymentsError,
  } = await supabase
    .from("payments")
    .select(
      "id, amount, quotation_id"
    )
    .eq(
      "organization_id",
      organizationId
    )
    .in(
      "quotation_id",
      quotationIds
    );

  if (paymentsError) {
    throw new Error(
      paymentsError.message
    );
  }

  const paymentsByQuotation =
    new Map<
      string,
      number
    >();

  for (
    const payment of
      (payments ??
        []) as PaymentFinancialRow[]
  ) {
    if (
      !payment.quotation_id
    ) {
      continue;
    }

    const current =
      paymentsByQuotation.get(
        payment.quotation_id
      ) ?? 0;

    paymentsByQuotation.set(
      payment.quotation_id,
      current +
        Number(payment.amount)
    );
  }

  return quotationRows
    .map((quotation) => {
      const quotationTotal =
        Number(
          quotation.total
        );

      const receivedAmount =
        paymentsByQuotation.get(
          quotation.id
        ) ?? 0;

      const remainingAmount =
        Math.max(
          quotationTotal -
            receivedAmount,
          0
        );

      return {
        quotationId:
          quotation.id,

        quotationNumber:
          quotation.quotation_number,

        clientId:
          quotation.client_id,

        clientName:
  quotation.clients?.[0]?.name ??
  "Unknown Client",

        eventId:
          quotation.event_id,

        eventName:
  quotation.events?.[0]?.event_name ??
  null,

        quotationTotal,

        receivedAmount,

        remainingAmount,

        status:
          quotation.status as
            | "Sent"
            | "Accepted",
      };
    })
    .filter(
      (quotation) =>
        quotation.remainingAmount >
        0
    );
}

export async function getPaymentSummary(): Promise<{
  totalReceived: number;
  thisMonthReceived: number;
  pendingAmount: number;
}> {
  const supabase =
    createClient();

  const organizationId =
    await getOrganizationId();

  const {
    data: payments,
    error: paymentsError,
  } = await supabase
    .from("payments")
    .select(
      "amount, payment_date"
    )
    .eq(
      "organization_id",
      organizationId
    );

  if (paymentsError) {
    throw new Error(
      paymentsError.message
    );
  }

  const {
    data: quotations,
    error: quotationsError,
  } = await supabase
    .from("quotations")
    .select(
      "id, total, status"
    )
    .eq(
      "organization_id",
      organizationId
    )
    .in(
      "status",
      ["Sent", "Accepted"]
    );

  if (quotationsError) {
    throw new Error(
      quotationsError.message
    );
  }

  const paymentRows =
    (payments ?? []) as Array<{
      amount: number | string;
      payment_date: string;
    }>;

  const quotationRows =
    (quotations ?? []) as Array<{
      id: string;
      total: number | string;
      status: string;
    }>;

  const totalReceived =
    paymentRows.reduce(
      (sum, payment) =>
        sum +
        Number(payment.amount),
      0
    );

  const now =
    new Date();

  const currentYear =
    now.getFullYear();

  const currentMonth =
    now.getMonth();

  const thisMonthReceived =
    paymentRows.reduce(
      (sum, payment) => {
        const paymentDate =
          new Date(
            `${payment.payment_date}T00:00:00`
          );

        if (
          paymentDate.getFullYear() ===
            currentYear &&
          paymentDate.getMonth() ===
            currentMonth
        ) {
          return (
            sum +
            Number(
              payment.amount
            )
          );
        }

        return sum;
      },
      0
    );

  const {
    data: quotationPayments,
    error: quotationPaymentsError,
  } = await supabase
    .from("payments")
    .select(
      "quotation_id, amount"
    )
    .eq(
      "organization_id",
      organizationId
    )
    .not(
      "quotation_id",
      "is",
      null
    );

  if (quotationPaymentsError) {
    throw new Error(
      quotationPaymentsError.message
    );
  }

  const paymentsByQuotation =
    new Map<
      string,
      number
    >();

  for (
    const payment of
      (quotationPayments ??
        []) as Array<{
        quotation_id:
          | string
          | null;
        amount:
          | number
          | string;
      }>
  ) {
    if (
      !payment.quotation_id
    ) {
      continue;
    }

    const current =
      paymentsByQuotation.get(
        payment.quotation_id
      ) ?? 0;

    paymentsByQuotation.set(
      payment.quotation_id,
      current +
        Number(payment.amount)
    );
  }

  const pendingAmount =
    quotationRows.reduce(
      (sum, quotation) => {
        const quotationTotal =
          Number(
            quotation.total
          );

        const received =
          paymentsByQuotation.get(
            quotation.id
          ) ?? 0;

        return (
          sum +
          Math.max(
            quotationTotal -
              received,
            0
          )
        );
      },
      0
    );

  return {
    totalReceived,
    thisMonthReceived,
    pendingAmount,
  };
}