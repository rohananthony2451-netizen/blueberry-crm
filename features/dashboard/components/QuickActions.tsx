import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button>New Lead</Button>

      <Button variant="outline">
        New Quotation
      </Button>

      <Button variant="outline">
        Record Payment
      </Button>

      <Button variant="outline">
        Create Event
      </Button>
    </div>
  );
}