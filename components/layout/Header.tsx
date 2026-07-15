"use client";

import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
}

export default function Header({
  title,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b bg-white px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="text-sm text-slate-500">
          Welcome back to Eventos.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative rounded-xl border p-3 transition hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3 rounded-xl border px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            A
          </div>

          <div>
            <p className="text-sm font-semibold">
              Avinash Anthony
            </p>

            <p className="text-xs text-slate-500">
              Blueberry Events
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}