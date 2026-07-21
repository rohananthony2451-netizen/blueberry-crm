import { Input } from "@/components/ui/input";

interface FormInputProps {
  placeholder?: string;
  type?: string;
}

export function FormInput({
  placeholder,
  type = "text",
}: FormInputProps) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
    />
  );
}