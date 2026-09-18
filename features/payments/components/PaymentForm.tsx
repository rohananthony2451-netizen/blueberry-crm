"use client";

import {
  useEffect,
} from "react";

import {
  useForm,
  useWatch,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import {
  FormActions,
} from "@/components/forms/FormActions";

import {
  FormField,
} from "@/components/forms/FormField";

import {
  FormInput,
} from "@/components/forms/FormInput";

import {
  FormSelect,
} from "@/components/forms/FormSelect";

import type { Client } from "@/features/clients/types";
import type { Event } from "@/features/events/types";
import type { Quotation } from "@/features/quotations/types";

import {
  PAYMENT_METHODS,
} from "../constants";

import type {
  PaymentFormValues,
} from "../types";

import {
  paymentSchema,
} from "../validation";

interface PaymentFormProps {
  clients: Client[];
  events: Event[];
  quotations: Quotation[];

  initialValues?: PaymentFormValues;

  onCancel?: () => void;

  onSave?: (
    data: PaymentFormValues
  ) => void | Promise<void>;

  saveText?: string;
}

export function PaymentForm({
  clients,
  events,
  quotations,
  initialValues,
  onCancel,
  onSave,
  saveText = "Record Payment",
}: PaymentFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {
      errors,
    },
  } = useForm<PaymentFormValues>({
    resolver:
      zodResolver(paymentSchema),

    defaultValues:
      initialValues ?? {
        clientId: "",
        eventId: "",
        quotationId: "",
        paymentDate:
          new Date()
            .toISOString()
            .split("T")[0],
        amount: "",
        paymentMethod: "Cash",
        referenceNumber: "",
        notes: "",
      },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [
    initialValues,
    reset,
  ]);

  const selectedClientId =
    useWatch({
      control,
      name: "clientId",
    });

  const selectedEventId =
    useWatch({
      control,
      name: "eventId",
    });

  const selectedQuotationId =
    useWatch({
      control,
      name: "quotationId",
    });

  const selectedPaymentMethod =
    useWatch({
      control,
      name: "paymentMethod",
    });

  const selectedClient =
    clients.find(
      (client) =>
        client.id ===
        selectedClientId
    );

  const clientEvents =
    selectedClientId
      ? events.filter(
          (event) =>
            event.clientName ===
            selectedClient?.name
        )
      : events;

  const clientQuotations =
    selectedClientId
      ? quotations.filter(
          (quotation) =>
            quotation.clientId ===
            selectedClientId
        )
      : quotations;

  async function submitForm(
    data: PaymentFormValues
  ) {
    await onSave?.(data);
  }

  return (
    <form
      onSubmit={
        handleSubmit(submitForm)
      }
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Client"
          error={
            errors.clientId?.message
          }
        >
          <FormSelect
            value={
              selectedClientId
            }
            onValueChange={(
              value
            ) => {
              setValue(
                "clientId",
                value,
                {
                  shouldValidate:
                    true,
                }
              );

              setValue(
                "eventId",
                "",
                {
                  shouldValidate:
                    true,
                }
              );

              setValue(
                "quotationId",
                "",
                {
                  shouldValidate:
                    true,
                }
              );
            }}
            placeholder="Select Client"
            options={clients.map(
              (client) => ({
                label:
                  client.name,
                value:
                  client.id,
              })
            )}
          />
        </FormField>

        <FormField
          label="Event"
          error={
            errors.eventId?.message
          }
        >
          <FormSelect
            value={
              selectedEventId
            }
            onValueChange={(
              value
            ) =>
              setValue(
                "eventId",
                value,
                {
                  shouldValidate:
                    true,
                }
              )
            }
            placeholder="Select Event"
            options={clientEvents.map(
              (event) => ({
                label:
                  event.eventName,
                value:
                  event.id,
              })
            )}
          />
        </FormField>

        <FormField
          label="Quotation"
          error={
            errors.quotationId?.message
          }
        >
          <FormSelect
            value={
              selectedQuotationId
            }
            onValueChange={(
              value
            ) =>
              setValue(
                "quotationId",
                value,
                {
                  shouldValidate:
                    true,
                }
              )
            }
            placeholder="Select Quotation"
            options={
              clientQuotations.map(
                (quotation) => ({
                  label:
                    quotation.quotationNumber,
                  value:
                    quotation.id,
                })
              )
            }
          />
        </FormField>

        <FormField
          label="Payment Date"
          error={
            errors.paymentDate?.message
          }
        >
          <FormInput
            type="date"
            {...register(
              "paymentDate"
            )}
          />
        </FormField>

        <FormField
          label="Amount"
          error={
            errors.amount?.message
          }
        >
          <FormInput
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter amount"
            {...register("amount")}
          />
        </FormField>

        <FormField
          label="Payment Method"
          error={
            errors.paymentMethod?.message
          }
        >
          <FormSelect
            value={
              selectedPaymentMethod
            }
            onValueChange={(
              value
            ) =>
              setValue(
                "paymentMethod",
                value as PaymentFormValues["paymentMethod"],
                {
                  shouldValidate:
                    true,
                }
              )
            }
            placeholder="Select Payment Method"
            options={
              PAYMENT_METHODS
            }
          />
        </FormField>

        <FormField
          label="Reference Number"
          error={
            errors.referenceNumber
              ?.message
          }
        >
          <FormInput
            placeholder="Transaction / cheque reference"
            {...register(
              "referenceNumber"
            )}
          />
        </FormField>
      </div>

      <FormField
        label="Notes"
        error={
          errors.notes?.message
        }
      >
        <textarea
          {...register("notes")}
          placeholder="Additional payment notes..."
          className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
        />
      </FormField>

      <FormActions
        onCancel={onCancel}
        saveText={saveText}
      />
    </form>
  );
}