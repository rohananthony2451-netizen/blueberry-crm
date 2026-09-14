"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormActions } from "@/components/forms/FormActions";
import { FormField } from "@/components/forms/FormField";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";

import { EVENT_TYPES } from "../constants";
import {
  eventSchema,
  EventFormValues,
} from "../validation";

interface EventFormProps {
  initialValues?: EventFormValues;
  onCancel?: () => void;
  onSave?: (
    data: EventFormValues
  ) => void | Promise<void>;
  saveText?: string;
}

export function EventForm({
  initialValues,
  onCancel,
  onSave,
  saveText = "Create Event",
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialValues ?? {
      eventName: "",
      clientName: "",
      eventType: "",
      eventDate: "",
      venue: "",
      guestCount: "",
    },
  });

  const eventType = watch("eventType");

  function submitForm(data: EventFormValues) {
    console.log("EVENT FORM SUBMITTED:", data);

    onSave?.(data);
  }

  function handleInvalidForm() {
    console.log("EVENT FORM VALIDATION ERRORS:", errors);
  }

  return (
    <form
      onSubmit={handleSubmit(
        submitForm,
        handleInvalidForm
      )}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">

        <FormField
          label="Event Name"
          error={errors.eventName?.message}
        >
          <FormInput
            placeholder="Sharma Wedding"
            {...register("eventName")}
          />
        </FormField>

        <FormField
          label="Client Name"
          error={errors.clientName?.message}
        >
          <FormInput
            placeholder="Rahul Sharma"
            {...register("clientName")}
          />
        </FormField>

        <FormField
          label="Event Type"
          error={errors.eventType?.message}
        >
          <FormSelect
            value={eventType}
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
          error={errors.eventDate?.message}
        >
          <FormInput
            type="date"
            {...register("eventDate")}
          />
        </FormField>

        <FormField
          label="Venue"
          error={errors.venue?.message}
        >
          <FormInput
            placeholder="Taj Hotel"
            {...register("venue")}
          />
        </FormField>

        <FormField
          label="Guest Count"
          error={errors.guestCount?.message}
        >
          <FormInput
            type="number"
            placeholder="350"
            {...register("guestCount")}
          />
        </FormField>

      </div>

      <FormActions
        onCancel={onCancel}
        saveText={saveText}
      />
    </form>
  );
}