"use client";

import { Bell, Search, UserCircle } from "lucide-react";

interface HeaderProps {
  title: string;
}

export default function Header({
  title,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-sm lg:px-8">

      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="hidden text-xs text-slate-500 sm:block">
          Welcome back to Eventify.
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="hidden h-9 w-72 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 md:flex">
          <Search size={16} />

          <span>
            Search anything...
          </span>

          <span className="ml-auto rounded-md border bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
            ⌘ K
          </span>
        </div>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell size={18} />

          <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100"
        >
          <UserCircle size={19} />
        </button>

      </div>

    </header>
  );
}