import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function QuickActions() {
  return (
    <Card className="rounded-2xl p-6">
      <h3 className="mb-5 text-lg font-semibold">
        Quick Actions
      </h3>

      <div className="grid gap-3 md:grid-cols-3">
        <Button>New Lead</Button>
        <Button variant="outline">Create Quote</Button>
        <Button variant="secondary">New Event</Button>
      </div>
    </Card>
  );
}