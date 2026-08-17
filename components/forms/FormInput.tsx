import { Input } from "@/components/ui/input";

import type { InputHTMLAttributes } from "react";

interface FormInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
}

export function FormInput({
    placeholder,
    ...props
}: FormInputProps) {
    return (
        <Input
            placeholder={placeholder}
            {...props}
        />
    );
}