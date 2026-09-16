import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FormSelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  placeholder: string;
  options: readonly (string | FormSelectOption)[];
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
        {options.map((option) => {
          const normalizedOption =
            typeof option === "string"
              ? {
                  label: option,
                  value: option,
                }
              : option;

          return (
            <SelectItem
              key={normalizedOption.value}
              value={normalizedOption.value}
            >
              {normalizedOption.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}