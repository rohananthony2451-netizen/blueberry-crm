import { Textarea } from "@/components/ui/textarea";

import type { TextareaHTMLAttributes } from "react";

interface FormTextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    placeholder?: string;
}

export function FormTextarea({
    placeholder,
    ...props
}: FormTextareaProps) {
    return (
        <Textarea
            placeholder={placeholder}
            {...props}
        />
    );
}