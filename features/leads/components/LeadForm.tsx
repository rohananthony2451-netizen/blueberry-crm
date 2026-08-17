"use client";

import { useForm } from "react-hook-form";

import { FormActions } from "@/components/forms/FormActions";
import { FormField } from "@/components/forms/FormField";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { LeadFormValues } from "../types/lead-form";
import {
    EVENT_TYPES,
    LEAD_SOURCES,
} from "../constants";


interface LeadFormProps {
    onCancel?: () => void;
    onSave?: (data: LeadFormValues) => void;
}

export function LeadForm({
    onCancel,
    onSave,
}: LeadFormProps) {

    const {
        register,
        handleSubmit,
        setValue,
        watch,
    } = useForm<LeadFormValues>({
        defaultValues: {
            clientName: "",
            phone: "",
            eventType: "",
            eventDate: "",
            budget: "",
            source: "",
            assignedTo: "",
            notes: "",
        },
    });

    const eventType = watch("eventType");
    const source = watch("source");
    const assignedTo = watch("assignedTo");

    function submitForm(data: LeadFormValues) {
        onSave?.(data);
    }

    return (
        <form
            onSubmit={handleSubmit(submitForm)}
            className="space-y-6"
        >

            <div className="grid gap-5 md:grid-cols-2">

                <FormField label="Client Name">
                    <FormInput
                        placeholder="John Doe"
                        {...register("clientName")}
                    />
                </FormField>

                <FormField label="Phone">
                    <FormInput
                        placeholder="+91 9876543210"
                        {...register("phone")}
                    />
                </FormField>

                <FormField label="Event Type">
                    <FormSelect
                        value={eventType}
                        onValueChange={(value) =>
                            setValue("eventType", value)
                        }
                        placeholder="Select Event Type"
                        options={[...EVENT_TYPES]}
                    />
                </FormField>

                <FormField label="Event Date">
                    <FormInput
                        type="date"
                        {...register("eventDate")}
                    />
                </FormField>

                <FormField label="Budget">
                    <FormInput
                        placeholder="₹ 500000"
                        {...register("budget")}
                    />
                </FormField>

                <FormField label="Source">
                    <FormSelect
                        value={source}
                       onValueChange={(value) =>
    setValue(
        "source",
        value as LeadFormValues["source"]
    )
}
                        placeholder="Select Source"
                        options={[...LEAD_SOURCES]}
                    />
                </FormField>

                <FormField label="Assigned To">
                    <FormSelect
                        value={assignedTo}
                        onValueChange={(value) =>
                            setValue("assignedTo", value)
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
                saveText="Save Lead"
            />

        </form>
    );
}