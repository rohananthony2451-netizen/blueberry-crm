"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormActions } from "@/components/forms/FormActions";
import { FormField } from "@/components/forms/FormField";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";

import { useClients } from "@/features/clients/hooks/useClients";

import { EVENT_TYPES } from "../constants";
import {
  eventSchema,
  EventFormValues,
} from "../validation";

interface EventFormProps {
  initialValues?: Partial<EventFormValues>;

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
    clients,
    loading: clientsLoading,
  } = useClients();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver:
      zodResolver(eventSchema),

    defaultValues: {
      eventName:
        initialValues?.eventName ?? "",

      clientId:
        initialValues?.clientId ?? "",

      eventType:
        initialValues?.eventType ?? "",

      eventDate:
        initialValues?.eventDate ?? "",

      venue:
        initialValues?.venue ?? "",

      guestCount:
        initialValues?.guestCount ?? "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        eventName:
          initialValues.eventName ?? "",

        clientId:
          initialValues.clientId ?? "",

        eventType:
          initialValues.eventType ?? "",

        eventDate:
          initialValues.eventDate ?? "",

        venue:
          initialValues.venue ?? "",

        guestCount:
          initialValues.guestCount ?? "",
      });
    }
  }, [initialValues, reset]);

  const eventType =
    watch("eventType");

  const clientId =
    watch("clientId");

  function submitForm(
    data: EventFormValues
  ) {
    onSave?.(data);
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
          label="Event Name"
          error={
            errors.eventName?.message
          }
        >
          <FormInput
            placeholder="Sharma Wedding"
            {...register("eventName")}
          />
        </FormField>

        <FormField
          label="Client"
          error={
            errors.clientId?.message
          }
        >
          {clientsLoading ? (
            <div className="flex h-10 items-center rounded-md border px-3 text-sm text-slate-500">
              Loading clients...
            </div>
          ) : clients.length === 0 ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Please create a client first.
            </div>
          ) : (
            <FormSelect
              value={clientId}
              onValueChange={(value) =>
                setValue(
                  "clientId",
                  value,
                  {
                    shouldValidate:
                      true,
                    shouldDirty: true,
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
          )}
        </FormField>

        <FormField
          label="Event Type"
          error={
            errors.eventType?.message
          }
        >
          <FormSelect
            value={eventType}
            onValueChange={(value) =>
              setValue(
                "eventType",
                value,
                {
                  shouldValidate:
                    true,
                  shouldDirty: true,
                }
              )
            }
            placeholder="Select Event Type"
            options={[
              ...EVENT_TYPES,
            ]}
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
            {...register(
              "eventDate"
            )}
          />
        </FormField>

        <FormField
          label="Venue"
          error={
            errors.venue?.message
          }
        >
          <FormInput
            placeholder="Taj Hotel"
            {...register("venue")}
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
            placeholder="350"
            {...register(
              "guestCount"
            )}
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