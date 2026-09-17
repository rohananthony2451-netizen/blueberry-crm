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
      row.quotations?.quotation_number ??
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
      row.reference_number ?? "",

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
  const supabase = createClient();

  const {
    data,
    error,
  } = await supabase
    .from("payments")
    .select(`
      *,
      clients (
        name
      ),
      events (
        event_name
      ),
      quotations (
        quotation_number
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapPayment(
    data as PaymentRow
  );
}

export async function getPayments(): Promise<
  Payment[]
> {
  const supabase = createClient();

  const {
    data,
    error,
  } = await supabase
    .from("payments")
    .select(`
      *,
      clients (
        name
      ),
      events (
        event_name
      ),
      quotations (
        quotation_number
      )
    `)
    .order("payment_date", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as PaymentRow[]).map(
    mapPayment
  );
}

export async function createPayment(
  payment: PaymentInput
): Promise<Payment> {
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

  if (payment.amount <= 0) {
    throw new Error(
      "Payment amount must be greater than 0."
    );
  }

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
        payment.eventId || null,

      quotation_id:
        payment.quotationId || null,

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
        payment.notes || null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return getPaymentById(data.id);
}