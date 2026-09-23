import { PAYMENT_METHODS } from "./constants";

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[number];

export interface Payment {
  id: string;
  organizationId: string;

  clientId: string;
  clientName: string;

  eventId: string | null;
  eventName: string | null;

  quotationId: string | null;
  quotationNumber: string | null;

  paymentNumber: string;
  paymentDate: string;

  amount: number;
  paymentMethod: PaymentMethod;

  referenceNumber: string;
  notes: string;

  createdAt: string;
  updatedAt: string;
}

export interface PaymentFormValues {
  clientId: string;
  eventId: string;
  quotationId: string;
  paymentDate: string;
  amount: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  notes: string;
}

export interface PaymentSummary {
  totalReceived: number;
  thisMonthReceived: number;
  pendingAmount: number;
}

export interface QuotationPaymentSummary {
  quotationId: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  eventId: string | null;
  eventName: string | null;
  quotationTotal: number;
  receivedAmount: number;
  remainingAmount: number;
  overpaidAmount: number;
  status: "Sent" | "Accepted";
}

export interface PendingPaymentItem {
  quotationId: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  eventId: string | null;
  eventName: string | null;
  quotationTotal: number;
  receivedAmount: number;
  remainingAmount: number;
  status: "Sent" | "Accepted";
}