
export const VENDOR_CATEGORIES = [
  "Venues",
  "Catering",
  "Photography",
  "Videography",
  "Decoration",
  "Florist",
  "Entertainment",
  "Sound & Lighting",
  "Transport",
  "Makeup & Styling",
  "Printing",
  "Rental",
  "Other",
] as const;

export type VendorCategory =
  (typeof VENDOR_CATEGORIES)[number];

export interface Vendor {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  website: string;
  notes: string;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
}

export type VendorFormValues = Omit<
  Vendor,
  "id" | "organizationId" | "createdAt" | "updatedAt"
>;
