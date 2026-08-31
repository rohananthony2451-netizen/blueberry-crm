import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: () => void;
  saveText?: string;
}

export function FormActions({
  onCancel,
  saveText = "Save",
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>

      <Button type="submit">
        {saveText}
      </Button>
    </div>
  );
}