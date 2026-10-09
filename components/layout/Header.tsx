"use client";

import {
  Bell,
  Search,
  UserCircle,
  Menu,
} from "lucide-react";

interface HeaderProps {
  title: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({
  title,
  sidebarCollapsed = false,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-[56px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 backdrop-blur-sm lg:px-4">
      {/* Breadcrumb / page context */}
      <div className="flex min-w-0 items-center gap-3">
        
{onToggleSidebar && (
  <button
    type="button"
    onClick={onToggleSidebar}
    aria-label="Open navigation menu"
    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 lg:hidden"
  >
    <Menu size={20} strokeWidth={1.9} />
  </button>
)}


        <div className="flex min-w-0 items-center gap-2 text-[13px]">
          <span className="text-slate-400">
            Home
          </span>

          <span className="text-slate-300">
            /
          </span>

          <span className="truncate font-semibold text-slate-900">
            {title}
          </span>
        </div>
      </div>

      {/* Header actions */}
      <div className="flex items-center gap-2">
        <div className="hidden h-8.5 w-64 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-400 md:flex lg:w-72">
          <Search
            size={15}
            strokeWidth={1.8}
          />

          <span>
            Search anything...
          </span>

          <span className="ml-auto rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            ⌘ K
          </span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell
            size={17}
            strokeWidth={1.9}
          />

          <span className="absolute right-1.5 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          aria-label="Profile"
          className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <UserCircle
            size={18}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </header>
  );
}