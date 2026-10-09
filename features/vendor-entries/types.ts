export const VENDOR_ENTRY_STATUSES = [
  "Pending",
  "Confirmed",
  "Paid",
  "Cancelled",
] as const;

export type VendorEntryStatus =
  (typeof VENDOR_ENTRY_STATUSES)[number];

export interface VendorEntry {
  id: string;
  organizationId: string;
  eventId: string;
  eventName: string;
  vendorId: string;
  vendorName: string;
  category: string;
  amount: number;
  entryDate: string;
  status: VendorEntryStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorEntryFormValues {
  eventId: string;
  vendorId: string;
  category: string;
  amount: number;
  entryDate: string;
  status: VendorEntryStatus;
  notes: string;
}