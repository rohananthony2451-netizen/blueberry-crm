"use client";

import { FormField } from "@/components/forms/FormField";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FormActions } from "@/components/forms/FormActions";
import { EVENT_TYPES } from "../constants";
import { LEAD_SOURCES } from "../constants";
import { LeadFormValues } from "../types/lead-form";

interface LeadFormProps {
  onCancel?: () => void;
  onSave?: () => void;
}

export function LeadForm({
  onCancel,
  onSave,
}: LeadFormProps) {
    return (
        <form className="space-y-5">

            <div>
               <FormField label="Client Name">
                <FormInput placeholder="John Doe" />
                </FormField>
            </div>

            <div>
                <FormField label="Phone">
                 <FormInput placeholder="+91 9876543210" />
                 </FormField>
            </div>

            <div>
                <FormField label="Event Type">
  <FormSelect
    placeholder="Select Event Type"
    options={EVENT_TYPES}
  />
</FormField>
            </div>

          <FormField label="Event Date">
  <FormInput type="date" />
</FormField>

            <div>
                <FormField label="Budget">
                 <FormInput placeholder="₹ 500000" />
                 </FormField>
            </div>

            <div>
                <FormField label="Source">
    <FormSelect
        placeholder="Select Source"
        options={LEAD_SOURCES}
    />
</FormField>
            </div>

            <div>
                <FormField label="Assigned To">
                <FormInput placeholder="Rohit" />
                </FormField>
            </div>

            <FormActions
    onCancel={onCancel}
    onSave={onSave}
    saveText="Save Lead"
/>
                

        </form>
    );
}