"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";

import Logo from "./Logo";
import Navigation from "./Navigation";
import UserProfile from "./UserProfile";
import LogoutButton from "@/components/shared/LogoutButton";
import { CurrentUser } from "@/app/(dashboard)/layout";

const SIDEBAR_STORAGE_KEY =
  "eventify-sidebar-collapsed";

interface SidebarProps {
  currentUser: CurrentUser;
}

export default function Sidebar({
  currentUser,
}: SidebarProps) {
  const [collapsed, setCollapsed] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    const saved =
      window.localStorage.getItem(
        SIDEBAR_STORAGE_KEY
      );

    setCollapsed(saved === "true");
    setMounted(true);
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;

      window.localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(next)
      );

      return next;
    });
  }

  return (
    <aside
      className={clsx(
        "hidden h-screen shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col",
        "transition-[width] duration-200 ease-in-out",
        collapsed
          ? "w-[72px]"
          : "w-[252px]"
      )}
    >
      <div
        className={clsx(
          "relative flex h-[72px] shrink-0 items-center border-b border-slate-100",
          collapsed
            ? "justify-center"
            : "justify-between"
        )}
      >
        {collapsed ? (
          <Logo collapsed />
        ) : (
          <Logo />
        )}

        {mounted && (
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            title={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className={clsx(
              "flex h-7 w-7 items-center justify-center rounded-lg",
              "text-slate-400 transition-all",
              "hover:bg-slate-100 hover:text-slate-700",
              collapsed
                ? "absolute -right-3.5 top-[22px] z-30 border border-slate-200 bg-white shadow-sm"
                : "mr-3"
            )}
          >
            {collapsed ? (
              <ChevronRight
                size={15}
                strokeWidth={2}
              />
            ) : (
              <ChevronLeft
                size={15}
                strokeWidth={2}
              />
            )}
          </button>
        )}
      </div>

      <div
        className={clsx(
          "min-h-0 flex-1 overflow-y-auto",
          "scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent",
          collapsed
            ? "px-2 py-4"
            : "px-3 py-4"
        )}
      >
        <Navigation
          collapsed={collapsed}
        />
      </div>

      <div
        className={clsx(
          "shrink-0 border-t border-slate-100 bg-white",
          collapsed
            ? "p-2"
            : "p-3"
        )}
      >
        <UserProfile
          collapsed={collapsed}
          currentUser={currentUser}
        />

        <LogoutButton
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}