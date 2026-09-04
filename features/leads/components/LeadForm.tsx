"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormActions } from "@/components/forms/FormActions";
import { FormField } from "@/components/forms/FormField";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";

import { EVENT_TYPES, LEAD_SOURCES } from "../constants";
import { leadSchema, LeadFormValues } from "../validation";

interface LeadFormProps {
  defaultValues?: Partial<LeadFormValues>;
  onCancel?: () => void;
  onSave?: (data: LeadFormValues) => void | Promise<void>;
  saveText?: string;
}

export function LeadForm({
  defaultValues,
  onCancel,
  onSave,
  saveText = "Save Lead",
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      clientName: "",
      phone: "",
      eventType: "",
      eventDate: "",
      budget: "",
      source: "",
      assignedTo: "",
      notes: "",
      ...defaultValues,
    },
  });

  const eventType = watch("eventType");
  const source = watch("source");
  const assignedTo = watch("assignedTo");

  async function submitForm(data: LeadFormValues) {
    await onSave?.(data);
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">

        <FormField
          label="Client Name"
          error={errors.clientName?.message}
        >
          <FormInput
            placeholder="John Doe"
            {...register("clientName")}
          />
        </FormField>

        <FormField
          label="Phone"
          error={errors.phone?.message}
        >
          <FormInput
            placeholder="+91 9876543210"
            {...register("phone")}
          />
        </FormField>

        <FormField
          label="Event Type"
          error={errors.eventType?.message}
        >
          <FormSelect
            value={eventType}
            onValueChange={(value) =>
              setValue(
                "eventType",
                value as LeadFormValues["eventType"],
                { shouldValidate: true }
              )
            }
            placeholder="Select Event Type"
            options={[...EVENT_TYPES]}
          />
        </FormField>

        <FormField
          label="Event Date"
          error={errors.eventDate?.message}
        >
          <FormInput
            type="date"
            {...register("eventDate")}
          />
        </FormField>

        <FormField
          label="Budget"
          error={errors.budget?.message}
        >
          <FormInput
            placeholder="₹ 500000"
            {...register("budget")}
          />
        </FormField>

        <FormField
          label="Source"
          error={errors.source?.message}
        >
          <FormSelect
            value={source}
            onValueChange={(value) =>
              setValue(
                "source",
                value as LeadFormValues["source"],
                { shouldValidate: true }
              )
            }
            placeholder="Select Source"
            options={[...LEAD_SOURCES]}
          />
        </FormField>

        <FormField
          label="Assigned To"
          error={errors.assignedTo?.message}
        >
          <FormSelect
            value={assignedTo}
            onValueChange={(value) =>
              setValue("assignedTo", value, {
                shouldValidate: true,
              })
            }
            placeholder="Select Salesperson"
            options={[
              "Avinash",
              "Rohit",
              "Sales Team",
            ]}
          />
        </FormField>

      </div>

      <FormField label="Notes">
        <FormTextarea
          placeholder="Additional client requirements..."
          {...register("notes")}
        />
      </FormField>

      <FormActions
        onCancel={onCancel}
        saveText={saveText}
      />
    </form>
  );
}