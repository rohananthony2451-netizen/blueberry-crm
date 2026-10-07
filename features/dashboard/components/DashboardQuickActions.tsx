import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  ReceiptIndianRupee,
  UsersRound,
} from "lucide-react";

const actions = [
  {
    title: "New Lead",
    description: "Add a prospect",
    href: "/leads",
    icon: UsersRound,
  },
  {
    title: "New Event",
    description: "Create an event",
    href: "/events",
    icon: CalendarPlus,
  },
  {
    title: "Record Payment",
    description: "Add a payment",
    href: "/payments",
    icon: ReceiptIndianRupee,
  },
];

export function DashboardQuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
          Shortcuts
        </p>

        <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
          Quick actions
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Get things done faster.
        </p>
      </div>

      <div className="mt-5 space-y-2.5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-3 transition-all duration-200 hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <Icon className="h-[18px] w-[18px]" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {action.title}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  {action.description}
                </p>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-600" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}