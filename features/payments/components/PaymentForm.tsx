"use client";

import {
  useEffect,
  useState,
} from "react";

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

import {
  PAYMENT_METHODS,
} from "../constants";

import {
  getQuotationPaymentSummary,
} from "../services/payment.service";

import type {
  PaymentFormValues,
  QuotationPaymentSummary,
} from "../types";

import {
  paymentSchema,
} from "../validation";

interface PaymentFormProps {
  clients: Client[];
  events: Event[];
  quotations: Quotation[];

  initialValues?: PaymentFormValues;

  currentPaymentId?: string;

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
  currentPaymentId,
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

  const [
    financialSummary,
    setFinancialSummary,
  ] =
    useState<QuotationPaymentSummary | null>(
      null
    );

  const [
    financialLoading,
    setFinancialLoading,
  ] =
    useState(false);

  const [
    overpaymentConfirmed,
    setOverpaymentConfirmed,
  ] =
    useState(false);

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

  const amount =
    useWatch({
      control,
      name: "amount",
    });

  const clientEvents =
    selectedClientId
      ? events.filter(
          (event) =>
            event.clientId ===
            selectedClientId
        )
      : [];

  const clientQuotations =
    selectedClientId
      ? quotations.filter(
          (quotation) =>
            quotation.clientId ===
            selectedClientId
        )
      : [];

  /*
   * Only active quotations
   * participate in automatic
   * financial allocation.
   *
   * Draft and Rejected remain
   * selectable so the payment
   * can be recorded, but they
   * are treated as unallocated.
   */
  const activeClientQuotations =
    clientQuotations.filter(
      (quotation) =>
        quotation.status ===
          "Sent" ||
        quotation.status ===
          "Accepted"
    );

  /*
   * When an event is selected,
   * show quotations attached
   * to that event.
   *
   * Quotations without an event
   * remain available when no
   * event is selected.
   */
  const availableQuotations =
    selectedEventId
      ? clientQuotations.filter(
          (quotation) =>
            quotation.eventId ===
            selectedEventId
        )
      : clientQuotations;

  /*
   * Quotation selection establishes
   * the client and event.
   */
  useEffect(() => {
    if (!selectedQuotationId) {
      setFinancialSummary(null);
      return;
    }

    const quotation =
      quotations.find(
        (item) =>
          item.id ===
          selectedQuotationId
      );

    if (!quotation) {
      setFinancialSummary(null);
      return;
    }

    if (
  quotation.clientId &&
  quotation.clientId !== selectedClientId
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
   * Event selection:
   *
   * one quotation  -> auto-select
   * multiple       -> user chooses
   */
  useEffect(() => {
    if (!selectedEventId) {
      return;
    }

    const matchingQuotations =
      activeClientQuotations.filter(
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
    activeClientQuotations,
    setValue,
  ]);

  /*
   * Load financial state for
   * the selected quotation.
   *
   * On edit, the current payment
   * is excluded from received
   * so that we don't count it twice.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadFinancialSummary() {
      if (!selectedQuotationId) {
        setFinancialSummary(null);
        return;
      }

      setFinancialLoading(true);
      setOverpaymentConfirmed(false);

      try {
        const summary =
          await getQuotationPaymentSummary(
            selectedQuotationId,
            currentPaymentId
          );

        if (!cancelled) {
          setFinancialSummary(
            summary
          );
        }
      } catch {
        if (!cancelled) {
          setFinancialSummary(null);
        }
      } finally {
        if (!cancelled) {
          setFinancialLoading(false);
        }
      }
    }

    loadFinancialSummary();

    return () => {
      cancelled = true;
    };
  }, [
    selectedQuotationId,
    currentPaymentId,
  ]);

  const numericAmount =
    Number(amount) || 0;

  const projectedReceived =
    financialSummary
      ? financialSummary.receivedAmount +
        numericAmount
      : 0;

  const projectedOverpayment =
    financialSummary
      ? Math.max(
          projectedReceived -
            financialSummary.quotationTotal,
          0
        )
      : 0;

  const isOverpayment =
    Boolean(
      financialSummary &&
        projectedOverpayment > 0
    );

  /*
   * A payment against Draft or
   * Rejected quotation is allowed,
   * but it is unallocated from
   * Client 360 financial totals.
   */
  const selectedQuotation =
    selectedQuotationId
      ? quotations.find(
          (quotation) =>
            quotation.id ===
            selectedQuotationId
        )
      : null;

  const isInactiveQuotation =
    Boolean(
      selectedQuotation &&
        selectedQuotation.status !==
          "Sent" &&
        selectedQuotation.status !==
          "Accepted"
    );

  async function submitForm(
    data: PaymentFormValues
  ) {
    if (
      isOverpayment &&
      !overpaymentConfirmed
    ) {
      return;
    }

    await onSave?.(data);
  }

  return (
    <form
      onSubmit={handleSubmit(
        submitForm
      )}
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

              const matching =
                activeClientQuotations.filter(
                  (quotation) =>
                    quotation.eventId ===
                    value
                );

              if (
                matching.length === 1
              ) {
                setValue(
                  "quotationId",
                  matching[0].id,
                  {
                    shouldValidate:
                      true,
                    shouldDirty:
                      true,
                  }
                );
              } else {
                setValue(
                  "quotationId",
                  "",
                  {
                    shouldValidate:
                      true,
                    shouldDirty:
                      true,
                  }
                );
              }
            }}
            placeholder={
              selectedClientId
                ? "Select Event"
                : "Select Client First"
            }
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
            ) => {
              setValue(
                "quotationId",
                value,
                {
                  shouldValidate:
                    true,
                  shouldDirty:
                    true,
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
                value:
                  quotation.id,
              })
            )}
          />
        </FormField>

        <FormField
          label="Payment Date"
          error={
            errors.paymentDate
              ?.message
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
            {...register(
              "amount"
            )}
          />
        </FormField>

        <FormField
          label="Payment Method"
          error={
            errors.paymentMethod
              ?.message
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
                  shouldDirty:
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

      {financialLoading && (
        <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
          Checking quotation payment status...
        </div>
      )}

      {financialSummary && (
        <div className="rounded-xl border bg-muted/40 p-4">
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">
                Quotation Total
              </p>
              <p className="font-semibold">
                ₹
                {financialSummary.quotationTotal.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">
                Already Received
              </p>
              <p className="font-semibold">
                ₹
                {financialSummary.receivedAmount.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">
                Remaining Before This Payment
              </p>
              <p className="font-semibold">
                ₹
                {financialSummary.remainingAmount.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {isInactiveQuotation && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">
            This quotation is not financially active.
          </p>

          <p className="mt-1">
            This payment can still be
            recorded, but it will be
            treated as unallocated in
            Client 360 because the
            quotation is{" "}
            <strong>
              {selectedQuotation?.status}
            </strong>
            .
          </p>
        </div>
      )}

      {isOverpayment && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <p className="font-semibold text-amber-900">
            Payment exceeds the quotation
            remaining amount.
          </p>

          <p className="mt-1 text-sm text-amber-800">
            This payment would make the
            quotation overpaid by ₹
            {projectedOverpayment.toLocaleString(
              "en-IN"
            )}
            .
          </p>

          {!overpaymentConfirmed ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  setValue(
                    "amount",
                    "",
                    {
                      shouldDirty:
                        true,
                    }
                  )
                }
                className="rounded-lg border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  setOverpaymentConfirmed(
                    true
                  )
                }
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white"
              >
                Record Anyway
              </button>
            </div>
          ) : (
            <p className="mt-3 text-sm font-medium text-amber-900">
              Overpayment accepted. Submit
              the form to record it.
            </p>
          )}
        </div>
      )}

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