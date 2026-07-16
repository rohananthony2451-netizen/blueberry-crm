import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KPIStatProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}

export function KPIStat({
  title,
  value,
  subtitle,
  icon: Icon,
}: KPIStatProps) {
  return (
    <Card className="rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

          <p className="mt-2 text-sm text-emerald-600">
            {subtitle}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </Card>
  );
}