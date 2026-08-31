import { z } from "zod";

export const leadSchema = z.object({
    clientName: z
        .string()
        .trim()
        .min(2, "Client name must be at least 2 characters."),

    phone: z
        .string()
        .trim()
        .min(10, "Enter a valid phone number.")
        .max(15, "Phone number is too long."),

    eventType: z
        .string()
        .min(1, "Please select an event type."),

    eventDate: z
        .string()
        .min(1, "Please select an event date."),

    budget: z
    .string()
    .trim()
    .min(1, "Please enter a budget.")
    .refine(
        (value) => {
            const normalized = value.replace(/[₹,\s]/g, "");
            return Number.isFinite(Number(normalized));
        },
        "Budget must be a valid number."
    ),

    source: z
        .string()
        .min(1, "Please select a lead source."),

    assignedTo: z.string(),

    notes: z
        .string()
        .optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;