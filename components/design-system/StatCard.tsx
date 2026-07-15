import { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {value}
          </h3>

          {change && (
            <p className="mt-2 text-sm text-emerald-600">
              {change}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-blue-100 p-3">
          <Icon
            size={24}
            className="text-blue-600"
          />
        </div>
      </div>
    </Card>
  );
}