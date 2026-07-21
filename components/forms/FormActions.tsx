import { Button } from "@/components/ui/button";

export function FormActions() {
  return (
    <div className="flex justify-end gap-3 pt-6">
      <Button
        type="button"
        variant="outline"
      >
        Cancel
      </Button>

      <Button type="submit">
        Save
      </Button>
    </div>
  );
}