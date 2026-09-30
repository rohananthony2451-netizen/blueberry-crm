"use client";

import { useEffect } from "react";

import {
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { FormActions } from "@/components/forms/FormActions";
import { FormField } from "@/components/forms/FormField";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { EVENT_TYPES } from "@/features/events/constants";
import type { QuotationFormValues } from "../types";

import { quotationSchema } from "../validation";

interface QuotationFormProps {
  initialValues?: QuotationFormValues;

  onCancel?: () => void;

  onSave?: (
    data: QuotationFormValues
  ) => void | Promise<void>;

  saveText?: string;
}

export function QuotationForm({
  initialValues,
  onCancel,
  onSave,
  saveText = "Save as Draft",
}: QuotationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),

    defaultValues:
      initialValues ?? {
        clientId: "",
        leadId: "",

        prospectName: "",
        prospectPhone: "",
        prospectEmail: "",
        prospectAddress: "",

        eventName: "",
        eventType: "",
        eventDate: "",
        venue: "",
        guestCount: "",

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
            ourExpense: false,
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

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const watchedItems = useWatch({
    control,
    name: "items",
  });

  const discount = useWatch({
    control,
    name: "discount",
  });

  const tax = useWatch({
    control,
    name: "tax",
  });

  const eventType = useWatch({
  control,
  name: "eventType",
});

  const subtotal =
    watchedItems?.reduce(
      (sum, item) => {
        const quantity =
          Number(item?.quantity) || 0;

        const unitPrice =
          Number(item?.unitPrice) || 0;

        return (
          sum +
          quantity * unitPrice
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
      onSubmit={handleSubmit(submitForm)}
      className="space-y-8"
    >
      {/* -------------------------------------------------- */}
      {/* Hidden relationship fields                         */}
      {/* -------------------------------------------------- */}

      <input
        type="hidden"
        {...register("clientId")}
      />

      <input
        type="hidden"
        {...register("leadId")}
      />

      {/* -------------------------------------------------- */}
      {/* Prospect / Customer                                */}
      {/* -------------------------------------------------- */}

      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold">
            Prospect / Customer
          </h3>

          <p className="text-sm text-slate-500">
            Enter the person requesting the quotation.
            They become a confirmed client only after
            the quotation is accepted.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Name"
            error={
              errors.prospectName?.message
            }
          >
            <FormInput
              placeholder="Rahul Sharma"
              {...register("prospectName")}
            />
          </FormField>

          <FormField
            label="Phone"
            error={
              errors.prospectPhone?.message
            }
          >
            <FormInput
              type="tel"
              placeholder="9876543210"
              {...register("prospectPhone")}
            />
          </FormField>

          <FormField
            label="Email"
            error={
              errors.prospectEmail?.message
            }
          >
            <FormInput
              type="email"
              placeholder="rahul@example.com"
              {...register("prospectEmail")}
            />
          </FormField>

          <FormField
            label="Address"
            error={
              errors.prospectAddress?.message
            }
          >
            <FormInput
              placeholder="Client address"
              {...register("prospectAddress")}
            />
          </FormField>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* Proposed Event                                     */}
      {/* -------------------------------------------------- */}

      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold">
            Proposed Event
          </h3>

          <p className="text-sm text-slate-500">
            This describes the event being quoted.
            It is not a confirmed Event record yet.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Event Name"
            error={
              errors.eventName?.message
            }
          >
            <FormInput
              placeholder="Rahul & Priya Wedding"
              {...register("eventName")}
            />
          </FormField>

          <FormField
  label="Event Type"
  error={errors.eventType?.message}
>
  <FormSelect
    value={eventType ?? ""}
    onValueChange={(value) =>
      setValue("eventType", value, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
    placeholder="Select Event Type"
    options={[...EVENT_TYPES]}
  />
</FormField>

          <FormField
            label="Event Date"
            error={
              errors.eventDate?.message
            }
          >
            <FormInput
              type="date"
              {...register("eventDate")}
            />
          </FormField>

          <FormField
            label="Guest Count"
            error={
              errors.guestCount?.message
            }
          >
            <FormInput
              type="number"
              min="1"
              step="1"
              placeholder="250"
              {...register("guestCount")}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Venue"
              error={
                errors.venue?.message
              }
            >
              <FormInput
                placeholder="The Grand Palace"
                {...register("venue")}
              />
            </FormField>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* Quotation Details                                  */}
      {/* -------------------------------------------------- */}

      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold">
            Quotation Details
          </h3>

          <p className="text-sm text-slate-500">
            Set the quotation issue date and validity.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Issue Date"
            error={
              errors.quotationDate?.message
            }
          >
            <FormInput
              type="date"
              {...register("quotationDate")}
            />
          </FormField>

          <FormField
            label="Valid Until"
            error={
              errors.validUntil?.message
            }
          >
            <FormInput
              type="date"
              {...register("validUntil")}
            />
          </FormField>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* Line Items                                         */}
      {/* -------------------------------------------------- */}

      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold">
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
              className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
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
                  ]?.description?.message
                }
              >
                <FormInput
                  placeholder="Venue decoration"
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
                  ]?.quantity?.message
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
                  ]?.unitPrice?.message
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

              {/* Our Expense switch */}

              <div
                className={
                  index === 0
                    ? "pt-6"
                    : ""
                }
              >
                <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3">
                  <input
                    type="checkbox"
                    {...register(
                      `items.${index}.ourExpense`
                    )}
                    className="h-4 w-4"
                  />

                  <span className="whitespace-nowrap text-sm">
                    Our Expense?
                  </span>
                </label>
              </div>

              {/* Remove */}

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
              ourExpense: false,
            })
          }
        >
          + Add Line Item
        </Button>
      </section>

      {/* -------------------------------------------------- */}
      {/* Pricing                                            */}
      {/* -------------------------------------------------- */}

      <section className="space-y-4">
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Discount"
            error={
              errors.discount?.message
            }
          >
            <FormInput
              type="number"
              min="0"
              step="0.01"
              {...register("discount")}
            />
          </FormField>

          <FormField
            label="Tax"
            error={
              errors.tax?.message
            }
          >
            <FormInput
              type="number"
              min="0"
              step="0.01"
              {...register("tax")}
            />
          </FormField>
        </div>

        <div className="rounded-xl border bg-slate-50 p-5">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>

            <span>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="mt-2 flex justify-between text-sm">
            <span>Discount</span>

            <span>
              − ₹
              {discountAmount.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="mt-2 flex justify-between text-sm">
            <span>Tax</span>

            <span>
              + ₹
              {taxAmount.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>

            <span>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* Notes                                              */}
      {/* -------------------------------------------------- */}

      <FormField
        label="Notes"
        error={
          errors.notes?.message
        }
      >
        <textarea
          {...register("notes")}
          placeholder="Additional notes..."
          className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
        />
      </FormField>

      {/* -------------------------------------------------- */}
      {/* Actions                                             */}
      {/* -------------------------------------------------- */}

      <FormActions
        onCancel={onCancel}
        saveText={saveText}
      />
    </form>
  );
}