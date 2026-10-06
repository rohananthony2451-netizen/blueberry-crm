"use client";

import { ChevronUp, UserCircle2 } from "lucide-react";
import clsx from "clsx";

interface UserProfileProps {
  collapsed?: boolean;
}

export default function UserProfile({
  collapsed = false,
}: UserProfileProps) {
  return (
    <div
      className={clsx(
        "bg-white",
        collapsed ? "p-1" : "p-2"
      )}
    >
      <button
        type="button"
        title={collapsed ? "Profile" : undefined}
        className={clsx(
          "flex w-full items-center rounded-xl transition hover:bg-slate-100",
          collapsed
            ? "justify-center p-2"
            : "gap-3 p-2"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
          <UserCircle2 size={22} />
        </div>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold">
                Loading...
              </p>

              <p className="truncate text-xs text-slate-500">
                Loading organization...
              </p>
            </div>

            <ChevronUp
              size={18}
              className="shrink-0 text-slate-500"
            />
          </>
        )}
      </button>
    </div>
  );
} 