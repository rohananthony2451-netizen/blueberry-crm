"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormActions } from "@/components/forms/FormActions";
import { FormField } from "@/components/forms/FormField";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";

import {
  clientSchema,
  ClientFormValues,
} from "../validation";

interface ClientFormProps {
  onCancel?: () => void;
  onSave?: (data: ClientFormValues) => void;
}

export function ClientForm({
  onCancel,
  onSave,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    },
  });

  function submitForm(data: ClientFormValues) {
    onSave?.(data);
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Client Name"
          error={errors.name?.message}
        >
          <FormInput
            placeholder="John Doe"
            {...register("name")}
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
          label="Email"
          error={errors.email?.message}
        >
          <FormInput
            type="email"
            placeholder="john@example.com"
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Address"
          error={errors.address?.message}
        >
          <FormInput
            placeholder="Client address"
            {...register("address")}
          />
        </FormField>
      </div>

      <FormField label="Notes">
        <FormTextarea
          placeholder="Additional client information..."
          {...register("notes")}
        />
      </FormField>

      <FormActions
        onCancel={onCancel}
        saveText="Save Client"
      />
    </form>
  );
}