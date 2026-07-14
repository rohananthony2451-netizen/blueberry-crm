"use client";

import { ChevronUp, UserCircle2 } from "lucide-react";

export default function UserProfile() {
  return (
    <div className="border-t bg-white p-4">
      <button className="flex w-full items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
          <UserCircle2 size={22} />
        </div>

        <div className="flex-1 text-left">
          <p className="text-sm font-semibold">
            Loading...
          </p>

          <p className="text-xs text-slate-500">
            Loading organization...
          </p>
        </div>

        <ChevronUp
          size={18}
          className="text-slate-500"
        />
      </button>
    </div>
  );
}