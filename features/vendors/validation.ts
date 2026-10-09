
import { z } from "zod";

export const vendorSchema = z.object({
  name: z.string().trim().min(2, "Vendor name must be at least 2 characters."),
  category: z.string().min(1, "Select a category."),
  contactPerson: z.string().trim().optional(),
  phone: z.string().trim().max(20, "Phone number is too long.").optional(),
  email: z.string().trim().email("Enter a valid email address.").or(z.literal("")).optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  website: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  rating: z.number().min(1).max(5).nullable().optional(),
});

export type VendorInput = z.infer<typeof vendorSchema>;
