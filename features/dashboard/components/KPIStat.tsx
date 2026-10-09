
import type { LucideIcon } from "lucide-react";

interface KPIStatProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export function KPIStat({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClassName = "bg-slate-50 text-slate-600",
}: KPIStatProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.06em] text-slate-700">
            {title}
          </p>

          <p className="mt-2.5 truncate text-[27px] font-bold leading-none tracking-[-0.03em] text-slate-950">
            {value}
          </p>

          <p className="mt-3 text-sm font-semibold text-emerald-600">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
        >
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
