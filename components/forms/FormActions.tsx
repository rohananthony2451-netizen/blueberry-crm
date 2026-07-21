import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: () => void;
  onSave?: () => void;
  saveText?: string;
}

export function FormActions({
  onCancel,
  onSave,
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

      <Button
        type="submit"
        onClick={onSave}
      >
        {saveText}
      </Button>
    </div>
  );
}