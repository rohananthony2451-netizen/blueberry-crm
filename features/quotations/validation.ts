import { z } from "zod";

const quotationItemSchema = z.object({
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
  clientId: z
    .string()
    .min(
      1,
      "Please select a client."
    ),

eventId: z.string(),

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

  notes: z
    .string(),

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