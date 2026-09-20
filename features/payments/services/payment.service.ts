import { createClient } from "@/lib/supabase/client";

import type {
  Payment,
  PaymentMethod,
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

async function getPaymentById(
  id: string
): Promise<Payment> {
  const supabase =
    createClient();

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

/*
 * Validate the relationships between
 * Client, Event and Quotation before
 * a payment is written.
 *
 * Foreign keys guarantee that the UUIDs
 * exist. These checks guarantee that
 * they belong together.
 */
async function validatePaymentRelationships(
  payment: PaymentInput
): Promise<void> {
  const supabase =
    createClient();

  const {
    data: client,
    error: clientError,
  } = await supabase
    .from("clients")
    .select("id")
    .eq("id", payment.clientId)
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

    /*
     * If the quotation itself is
     * attached to an event, the payment
     * cannot point to a different event.
     */
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
    .select("*")
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

  const {
    error,
  } = await supabase
    .from("payments")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }
}

export async function getPaymentSummary(): Promise<{
  totalReceived: number;
  thisMonthReceived: number;
  pendingAmount: number;
}> {
  const supabase =
    createClient();

  const {
    data: payments,
    error: paymentsError,
  } = await supabase
    .from("payments")
    .select(
      "amount, payment_date, quotation_id"
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
    .select("id, total");

  if (quotationsError) {
    throw new Error(
      quotationsError.message
    );
  }

  const paymentRows =
    (payments ?? []) as Array<{
      amount: number | string;
      payment_date: string;
      quotation_id:
        | string
        | null;
    }>;

  const quotationRows =
    (quotations ?? []) as Array<{
      id: string;
      total: number | string;
    }>;

  const totalReceived =
    paymentRows.reduce(
      (sum, payment) =>
        sum +
        Number(payment.amount),
      0
    );

  const now = new Date();

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

  const paymentsByQuotation =
    new Map<
      string,
      number
    >();

  for (
    const payment of paymentRows
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
        Number(
          payment.amount
        )
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

        const outstanding =
          Math.max(
            quotationTotal -
              received,
            0
          );

        return (
          sum +
          outstanding
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