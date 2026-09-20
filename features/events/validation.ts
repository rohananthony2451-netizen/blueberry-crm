import { z } from "zod";

export const eventSchema = z.object({
  eventName: z
    .string()
    .trim()
    .min(
      2,
      "Event name must be at least 2 characters."
    ),

  clientId: z
    .string()
    .min(1, "Please select a client."),

  eventType: z
    .string()
    .min(1, "Please select an event type."),

  eventDate: z
    .string()
    .min(1, "Please select an event date."),

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
          Number.isInteger(number) &&
          number > 0
        );
      },
      "Guest count must be a positive whole number."
    ),
});

export type EventFormValues =
  z.infer<typeof eventSchema>;