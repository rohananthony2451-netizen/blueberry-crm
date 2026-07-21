import { Textarea } from "@/components/ui/textarea";

interface FormTextareaProps {
  placeholder?: string;
}

export function FormTextarea({
  placeholder,
}: FormTextareaProps) {
  return (
    <Textarea
      placeholder={placeholder}
    />
  );
}