import { Card } from "@/components/ui/card";
import { recentActivities } from "../data/mock-dashboard";

export function RecentActivity() {
  return (
    <Card className="rounded-2xl p-6">
      <h3 className="mb-5 text-lg font-semibold">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="border-b pb-3 last:border-none"
          >
            <p className="font-medium">
              {activity.title}
            </p>

            <p className="text-sm text-slate-500">
              {activity.customer}
            </p>

            <p className="text-xs text-slate-400">
              {activity.time}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}