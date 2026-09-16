"use client";

import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Button,
} from "@/components/ui/button";

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

import {
  QuotationFormValues,
} from "../types";

import {
  quotationSchema,
} from "../validation";

import type {
  Client,
} from "@/features/clients/types";

import type {
  Event,
} from "@/features/events/types";

interface QuotationFormProps {
  clients: Client[];
  events: Event[];
  onCancel?: () => void;
  onSave?: (
    data: QuotationFormValues
  ) => void | Promise<void>;
  saveText?: string;
}

export function QuotationForm({
  clients,
  events,
  onCancel,
  onSave,
  saveText = "Save as Draft",
}: QuotationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: {
      errors,
    },
  } = useForm<QuotationFormValues>({
    resolver:
      zodResolver(
        quotationSchema
      ),

    defaultValues: {
      clientId: "",
      eventId: "",
      quotationDate:
        new Date()
          .toISOString()
          .split("T")[0],
      validUntil: "",
      discount: "0",
      tax: "0",
      notes: "",
      items: [
        {
          description: "",
          quantity: "1",
          unitPrice: "0",
        },
      ],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

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

  const watchedItems =
    useWatch({
      control,
      name: "items",
    });

  const discount =
    useWatch({
      control,
      name: "discount",
    });

  const tax =
    useWatch({
      control,
      name: "tax",
    });

  const subtotal =
    watchedItems?.reduce(
      (sum, item) => {
        const quantity =
          Number(
            item?.quantity
          ) || 0;

        const unitPrice =
          Number(
            item?.unitPrice
          ) || 0;

        return (
          sum +
          quantity *
            unitPrice
        );
      },
      0
    ) ?? 0;

  const discountAmount =
    Number(discount) || 0;

  const taxAmount =
    Number(tax) || 0;

  const total =
    subtotal -
    discountAmount +
    taxAmount;

  async function submitForm(
    data: QuotationFormValues
  ) {
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
            errors.clientId
              ?.message
          }
        >
          <FormSelect
            value={selectedClientId}
            onValueChange={(value) =>
              setValue(
                "clientId",
                value,
                {
                  shouldValidate: true,
                }
              )
            }
            placeholder="Select Client"
            options={clients.map(
              (client) => ({
                label: client.name,
                value: client.id,
              })
            )}
          />
        </FormField>

        <FormField
          label="Event"
          error={
            errors.eventId
              ?.message
          }
        >
          <FormSelect
            value={selectedEventId}
            onValueChange={(value) =>
              setValue(
                "eventId",
                value,
                {
                  shouldValidate: true,
                }
              )
            }
            placeholder="Select Event"
            options={events.map(
              (event) => ({
                label: event.eventName,
                value: event.id,
              })
            )}
          />
        </FormField>

        <FormField
          label="Issue Date"
          error={
            errors.quotationDate
              ?.message
          }
        >
          <FormInput
            type="date"
            {...register(
              "quotationDate"
            )}
          />
        </FormField>

        <FormField
          label="Valid Until"
          error={
            errors.validUntil
              ?.message
          }
        >
          <FormInput
            type="date"
            {...register(
              "validUntil"
            )}
          />
        </FormField>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold">
            Line Items
          </h3>

          <p className="text-xs text-slate-500">
            Add the services included in this quotation.
          </p>
        </div>

        {fields.map(
          (field, index) => (
            <div
              key={field.id}
              className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]"
            >
              <FormField
                label={
                  index === 0
                    ? "Description"
                    : ""
                }
                error={
                  errors.items?.[
                    index
                  ]?.description
                    ?.message
                }
              >
                <FormInput
                  placeholder="Venue coordination"
                  {...register(
                    `items.${index}.description`
                  )}
                />
              </FormField>

              <FormField
                label={
                  index === 0
                    ? "Quantity"
                    : ""
                }
                error={
                  errors.items?.[
                    index
                  ]?.quantity
                    ?.message
                }
              >
                <FormInput
                  type="number"
                  min="0.01"
                  step="0.01"
                  {...register(
                    `items.${index}.quantity`
                  )}
                />
              </FormField>

              <FormField
                label={
                  index === 0
                    ? "Unit Price"
                    : ""
                }
                error={
                  errors.items?.[
                    index
                  ]?.unitPrice
                    ?.message
                }
              >
                <FormInput
                  type="number"
                  min="0"
                  step="0.01"
                  {...register(
                    `items.${index}.unitPrice`
                  )}
                />
              </FormField>

              <div
                className={
                  index === 0
                    ? "pt-6"
                    : ""
                }
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    remove(index)
                  }
                  disabled={
                    fields.length === 1
                  }
                >
                  Remove
                </Button>
              </div>
            </div>
          )
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              description: "",
              quantity: "1",
              unitPrice: "0",
            })
          }
        >
          + Add Line Item
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Discount"
          error={
            errors.discount
              ?.message
          }
        >
          <FormInput
            type="number"
            min="0"
            step="0.01"
            {...register(
              "discount"
            )}
          />
        </FormField>

        <FormField
          label="Tax"
          error={
            errors.tax
              ?.message
          }
        >
          <FormInput
            type="number"
            min="0"
            step="0.01"
            {...register(
              "tax"
            )}
          />
        </FormField>
      </div>

      <div className="rounded-xl border bg-slate-50 p-5">
        <div className="flex justify-between text-sm">
          <span>
            Subtotal
          </span>

          <span>
            ₹
            {subtotal.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span>
            Discount
          </span>

          <span>
            − ₹
            {discountAmount.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span>
            Tax
          </span>

          <span>
            + ₹
            {taxAmount.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>

        <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
          <span>
            Total
          </span>

          <span>
            ₹
            {total.toLocaleString(
              "en-IN"
            )}
          </span>
        </div>
      </div>

      <FormField
        label="Notes"
        error={
          errors.notes
            ?.message
        }
      >
        <textarea
          {...register("notes")}
          placeholder="Additional notes..."
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