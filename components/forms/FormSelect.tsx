import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSelectProps {
  placeholder: string;
  options: readonly string[];
   value?: string;
  onValueChange?: (value: string) => void;
}

export function FormSelect({
  placeholder,
  options,
  value,
  onValueChange,
}: FormSelectProps) {
  return (
    <Select
  value={value}
  onValueChange={onValueChange}
>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map(option => (
          <SelectItem
            key={option}
            value={option}
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}