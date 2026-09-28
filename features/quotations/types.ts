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
  ourExpense: boolean;
  createdAt: string;
}

export interface Quotation {
  id: string;
  organizationId: string;
  quotationNumber: string;

  // Confirmed relationships.
  // These remain null until quotation acceptance.
  clientId: string | null;
  clientName: string;

  eventId: string | null;
  eventName: string | null;

  // Prospect snapshot.
  leadId: string | null;
  prospectName: string;
  prospectPhone: string;
  prospectEmail: string;
  prospectAddress: string;

  // Proposed event information.
  proposedEventName: string;
  proposedEventType: string;
  proposedEventDate: string;
  proposedVenue: string;
  proposedGuestCount: number;

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
  id?: string;
  description: string;
  quantity: string;
  unitPrice: string;
  ourExpense: boolean;
}

export interface QuotationFormValues {
  // Optional existing confirmed customer.
  //
  // Used when quotation is created from Client 360.
  clientId: string;

  // Optional originating Lead.
  leadId: string;

  prospectName: string;
  prospectPhone: string;
  prospectEmail: string;
  prospectAddress: string;

  eventName: string;
  eventType: string;
  eventDate: string;
  venue: string;
  guestCount: string;

  quotationDate: string;
  validUntil: string;

  discount: string;
  tax: string;

  notes: string;

  items: QuotationItemFormValues[];
}