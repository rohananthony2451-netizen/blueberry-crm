import { QUOTATION_STATUSES } from "./constants";

export type QuotationStatus =
  (typeof QUOTATION_STATUSES)[number];

export interface QuotationItem {
  id: string;
  quotationId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  createdAt: string;
}

export interface Quotation {
  id: string;
  organizationId: string;

  quotationNumber: string;

  clientId: string;
  clientName: string;

  eventId: string | null;
  eventName: string | null;

  quotationDate: string;
  validUntil: string | null;

  status: QuotationStatus;

  subtotal: number;
  discount: number;
  tax: number;
  total: number;

  notes: string;

  items: QuotationItem[];

  createdAt: string;
  updatedAt: string;
}

export interface QuotationItemFormValues {
  description: string;
  quantity: string;
  unitPrice: string;
}

export interface QuotationFormValues {
  clientId: string;
  eventId: string;

  quotationDate: string;
  validUntil: string;

  discount: string;
  tax: string;

  notes: string;

  items: QuotationItemFormValues[];
}