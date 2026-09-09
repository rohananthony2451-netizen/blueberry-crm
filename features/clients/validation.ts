import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Client name must be at least 2 characters."),

  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number.")
    .max(15, "Phone number is too long."),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .optional(),

  notes: z
    .string()
    .optional(),
});

export type ClientFormValues = z.infer<
  typeof clientSchema
>;