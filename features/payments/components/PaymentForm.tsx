"use client";

import { useEffect } from "react";

import {
  useForm,
  useWatch,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { FormActions } from "@/components/forms/FormActions";
import { FormField } from "@/components/forms/FormField";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";

import type { Client } from "@/features/clients/types";
import type { Event } from "@/features/events/types";
import type { Quotation } from "@/features/quotations/types";

import { PAYMENT_METHODS } from "../constants";

import type {
  PaymentFormValues,
} from "../types";

import { paymentSchema } from "../validation";

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
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),

    defaultValues:
      initialValues ?? {
        clientId: "",
        eventId: "",
        quotationId: "",
        paymentDate: new Date()
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
  }, [initialValues, reset]);

  const selectedClientId = useWatch({
    control,
    name: "clientId",
  });

  const selectedEventId = useWatch({
    control,
    name: "eventId",
  });

  const selectedQuotationId = useWatch({
    control,
    name: "quotationId",
  });

  const selectedPaymentMethod = useWatch({
    control,
    name: "paymentMethod",
  });

  /*
   * --------------------------------------------------
   * CLIENT → EVENTS
   * --------------------------------------------------
   */

  const clientEvents = selectedClientId
    ? events.filter(
        (event) =>
          event.clientId === selectedClientId
      )
    : [];

  /*
   * --------------------------------------------------
   * CLIENT → QUOTATIONS
   * --------------------------------------------------
   *
   * Without an event selected:
   * show all quotations for the client.
   *
   * With an event selected:
   * show only quotations belonging to that event.
   */

  const clientQuotations = selectedClientId
    ? quotations.filter(
        (quotation) =>
          quotation.clientId === selectedClientId
      )
    : [];

  const availableQuotations = selectedEventId
    ? clientQuotations.filter(
        (quotation) =>
          quotation.eventId === selectedEventId
      )
    : clientQuotations;

  /*
   * --------------------------------------------------
   * QUOTATION → CLIENT + EVENT
   * --------------------------------------------------
   *
   * Selecting a quotation establishes its
   * relationships automatically.
   */

  useEffect(() => {
    if (!selectedQuotationId) {
      return;
    }

    const quotation = quotations.find(
      (item) =>
        item.id === selectedQuotationId
    );

    if (!quotation) {
      return;
    }

    if (
      quotation.clientId !==
      selectedClientId
    ) {
      setValue(
        "clientId",
        quotation.clientId,
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }

    const quotationEventId =
      quotation.eventId ?? "";

    if (
      quotationEventId !==
      selectedEventId
    ) {
      setValue(
        "eventId",
        quotationEventId,
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }
  }, [
    selectedQuotationId,
    selectedClientId,
    selectedEventId,
    quotations,
    setValue,
  ]);

  /*
   * --------------------------------------------------
   * EVENT → QUOTATION
   * --------------------------------------------------
   *
   * When an event is selected:
   *
   * 0 quotations:
   *   keep quotation empty.
   *
   * 1 quotation:
   *   automatically select it.
   *
   * Multiple quotations:
   *   let the user choose.
   */

  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    const matchingQuotations =
      clientQuotations.filter(
        (quotation) =>
          quotation.eventId ===
          selectedEventId
      );

    if (
      matchingQuotations.length === 1
    ) {
      const onlyQuotation =
        matchingQuotations[0];

      if (
        selectedQuotationId !==
        onlyQuotation.id
      ) {
        setValue(
          "quotationId",
          onlyQuotation.id,
          {
            shouldValidate: true,
            shouldDirty: true,
          }
        );
      }

      return;
    }

    /*
     * If there are multiple quotations,
     * only keep the current selection if
     * it still belongs to this event.
     */

    if (
      selectedQuotationId &&
      !matchingQuotations.some(
        (quotation) =>
          quotation.id ===
          selectedQuotationId
      )
    ) {
      setValue(
        "quotationId",
        "",
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }
  }, [
    selectedEventId,
    selectedQuotationId,
    clientQuotations,
    setValue,
  ]);

  /*
   * --------------------------------------------------
   * FORM SUBMISSION
   * --------------------------------------------------
   */

  async function submitForm(
    data: PaymentFormValues
  ) {
    await onSave?.(data);
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {/* CLIENT */}

        <FormField
          label="Client"
          error={
            errors.clientId?.message
          }
        >
          <FormSelect
            value={selectedClientId}
            onValueChange={(value) => {
              setValue(
                "clientId",
                value,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              );

              setValue(
                "eventId",
                "",
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              );

              setValue(
                "quotationId",
                "",
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              );
            }}
            placeholder="Select Client"
            options={clients.map(
              (client) => ({
                label: client.name,
                value: client.id,
              })
            )}
          />
        </FormField>

        {/* EVENT */}

        <FormField
          label="Event"
          error={
            errors.eventId?.message
          }
        >
          <FormSelect
            value={selectedEventId}
            onValueChange={(value) => {
              setValue(
                "eventId",
                value,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              );
            }}
            placeholder={
              selectedClientId
                ? "Select Event"
                : "Select Client First"
            }
            options={clientEvents.map(
              (event) => ({
                label: event.eventName,
                value: event.id,
              })
            )}
          />
        </FormField>

        {/* QUOTATION */}

        <FormField
          label="Quotation"
          error={
            errors.quotationId?.message
          }
        >
          <FormSelect
            value={selectedQuotationId}
            onValueChange={(value) => {
              setValue(
                "quotationId",
                value,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              );
            }}
            placeholder={
              selectedClientId
                ? "Select Quotation"
                : "Select Client First"
            }
            options={availableQuotations.map(
              (quotation) => ({
                label:
                  `${quotation.quotationNumber} — ${quotation.clientName}${quotation.eventName ? ` — ${quotation.eventName}` : ""}`,
                value: quotation.id,
              })
            )}
          />
        </FormField>

        {/* PAYMENT DATE */}

        <FormField
          label="Payment Date"
          error={
            errors.paymentDate?.message
          }
        >
          <FormInput
            type="date"
            {...register("paymentDate")}
          />
        </FormField>

        {/* AMOUNT */}

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

        {/* PAYMENT METHOD */}

        <FormField
          label="Payment Method"
          error={
            errors.paymentMethod?.message
          }
        >
          <FormSelect
            value={selectedPaymentMethod}
            onValueChange={(value) =>
              setValue(
                "paymentMethod",
                value as PaymentFormValues["paymentMethod"],
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              )
            }
            placeholder="Select Payment Method"
            options={PAYMENT_METHODS}
          />
        </FormField>

        {/* REFERENCE */}

        <FormField
          label="Reference Number"
          error={
            errors.referenceNumber?.message
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

      {/* NOTES */}

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