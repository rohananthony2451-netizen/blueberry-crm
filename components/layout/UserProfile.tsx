"use client";

import {
  ChevronUp,
  UserCircle2,
} from "lucide-react";
import clsx from "clsx";

import { CurrentUser } from "@/app/(dashboard)/layout";

interface UserProfileProps {
  collapsed?: boolean;
  currentUser: CurrentUser;
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

function formatRole(role: string) {
  return role
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}

export default function UserProfile({
  collapsed = false,
  currentUser,
}: UserProfileProps) {
  const initials = getInitials(
    currentUser.fullName
  );

  return (
    <div
      className={clsx(
        "bg-white",
        collapsed ? "p-1" : "p-1"
      )}
    >
      <button
        type="button"
        title={
          collapsed
            ? `${currentUser.fullName} · ${formatRole(
                currentUser.role
              )}`
            : undefined
        }
        className={clsx(
          "flex w-full items-center rounded-xl transition",
          "hover:bg-slate-50",
          collapsed
            ? "justify-center p-2"
            : "gap-3 px-2 py-2"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-xs font-bold text-white ring-2 ring-blue-50">
          {currentUser.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUser.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[13px] font-semibold text-slate-900">
                {currentUser.fullName}
              </p>

              <p className="truncate text-[11px] font-medium text-slate-400">
                {formatRole(currentUser.role)}
                {" · "}
                {currentUser.organizationName}
              </p>
            </div>

            <ChevronUp
              size={16}
              className="shrink-0 text-slate-400"
            />
          </>
        )}
      </button>
    </div>
  );
}