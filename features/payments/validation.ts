import { z } from "zod";

import { PAYMENT_METHODS } from "./constants";

const paymentMethodSchema = z.enum(
  PAYMENT_METHODS
);

export const paymentSchema = z.object({
  clientId: z
    .string()
    .min(1, "Please select a client."),

  eventId: z.string(),

  quotationId: z.string(),

  paymentDate: z
    .string()
    .min(1, "Please select the payment date."),

  amount: z
    .string()
    .trim()
    .min(1, "Please enter the payment amount.")
    .refine(
      (value) => {
        const number = Number(value);

        return (
          Number.isFinite(number) &&
          number > 0
        );
      },
      "Payment amount must be greater than 0."
    ),

  paymentMethod: paymentMethodSchema,

  referenceNumber: z.string(),

  notes: z.string(),
});

export type PaymentFormValues =
  z.infer<typeof paymentSchema>;