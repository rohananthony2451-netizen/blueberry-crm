import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSelectProps {
  placeholder: string;
  options: string[];
}

export function FormSelect({
  placeholder,
  options,
}: FormSelectProps) {
  return (
    <Select>
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