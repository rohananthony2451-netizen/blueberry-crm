import { z } from "zod";

const quotationItemSchema = z.object({
  id: z.string().optional(),

  description: z
    .string()
    .trim()
    .min(
      2,
      "Item description must be at least 2 characters."
    ),

  quantity: z
    .string()
    .trim()
    .min(
      1,
      "Please enter the quantity."
    )
    .refine(
      (value) => {
        const number = Number(value);

        return (
          Number.isFinite(number) &&
          number > 0
        );
      },
      "Quantity must be greater than 0."
    ),

  unitPrice: z
    .string()
    .trim()
    .min(
      1,
      "Please enter the unit price."
    )
    .refine(
      (value) => {
        const number = Number(value);

        return (
          Number.isFinite(number) &&
          number >= 0
        );
      },
      "Unit price cannot be negative."
    ),
});

export const quotationSchema = z.object({
  /*
   * Empty string means this quotation
   * is not associated with an existing
   * Client yet.
   */
  clientId: z.string(),

  /*
   * Empty string means this quotation
   * did not originate from a Lead.
   *
   * Both clientId and leadId can therefore
   * legitimately be empty for a walk-in.
   */
  leadId: z.string(),

  /*
   * Prospect information is stored directly
   * on the quotation until acceptance.
   */
  prospectName: z
    .string()
    .trim()
    .min(
      2,
      "Prospect name must be at least 2 characters."
    ),

  prospectPhone: z
    .string()
    .trim()
    .min(
      7,
      "Please enter a valid phone number."
    ),

  prospectEmail: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        z
          .string()
          .email()
          .safeParse(value).success,
      "Please enter a valid email address."
    ),

  prospectAddress: z.string(),

  /*
   * Proposed event information.
   *
   * This is NOT a confirmed Event record yet.
   */
  eventName: z
    .string()
    .trim()
    .min(
      2,
      "Event name must be at least 2 characters."
    ),

  eventType: z
    .string()
    .trim()
    .min(
      2,
      "Event type must be at least 2 characters."
    ),

  eventDate: z
    .string()
    .min(
      1,
      "Please select the proposed event date."
    ),

  venue: z
    .string()
    .trim()
    .min(
      2,
      "Venue must be at least 2 characters."
    ),

  guestCount: z
    .string()
    .trim()
    .min(
      1,
      "Please enter the guest count."
    )
    .refine(
      (value) => {
        const number = Number(value);

        return (
          Number.isFinite(number) &&
          number > 0 &&
          Number.isInteger(number)
        );
      },
      "Guest count must be a whole number greater than 0."
    ),

  quotationDate: z
    .string()
    .min(
      1,
      "Please select the quotation date."
    ),

  validUntil: z.string(),

  discount: z
    .string()
    .trim()
    .min(
      1,
      "Please enter the discount."
    )
    .refine(
      (value) => {
        const number = Number(value);

        return (
          Number.isFinite(number) &&
          number >= 0
        );
      },
      "Discount cannot be negative."
    ),

  tax: z
    .string()
    .trim()
    .min(
      1,
      "Please enter the tax."
    )
    .refine(
      (value) => {
        const number = Number(value);

        return (
          Number.isFinite(number) &&
          number >= 0
        );
      },
      "Tax cannot be negative."
    ),

  notes: z.string(),

  items: z
    .array(quotationItemSchema)
    .min(
      1,
      "A quotation must contain at least one item."
    ),
});

export { quotationItemSchema };

export type QuotationFormValues =
  z.infer<typeof quotationSchema>;

export type QuotationItemFormValues =
  z.infer<typeof quotationItemSchema>;