"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronRight,
  Search,
  UserCircle,
} from "lucide-react";

function getPageName(pathname: string) {
  const segments = pathname
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return "Dashboard";
  }

  const segment = segments[segments.length - 1];

  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    leads: "Leads",
    quotations: "Quotations",
    clients: "Clients",
    events: "Events",
    team: "Team",
    payments: "Payments",
    expenses: "Expenses",
    vendors: "Vendors",
    "vendor-entries": "Vendor Entries",
    reports: "Reports",
    settings: "Settings",
  };

  return (
    labels[segment] ??
    segment
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ")
  );
}

export default function Header() {
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-7">
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 items-center gap-1.5 text-sm"
      >
        <Link
          href="/dashboard"
          className="font-medium text-slate-400 transition-colors hover:text-slate-700"
        >
          Home
        </Link>

        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />

        <span className="truncate font-semibold text-slate-800">
          {pageName}
        </span>
      </nav>

      <div className="flex items-center gap-2.5">
        <div className="hidden h-9 w-72 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 md:flex">
          <Search className="h-4 w-4 shrink-0" />

          <span>Search anything...</span>

          <span className="ml-auto rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            ⌘ K
          </span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell className="h-[18px] w-[18px]" />

          <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          aria-label="Profile"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <UserCircle className="h-[19px] w-[19px]" />
        </button>
      </div>
    </header>
  );
}