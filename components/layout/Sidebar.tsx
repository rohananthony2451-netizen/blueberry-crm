"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

import Logo from "./Logo";
import Navigation from "./Navigation";
import UserProfile from "./UserProfile";
import LogoutButton from "@/components/shared/LogoutButton";

const SIDEBAR_STORAGE_KEY = "eventify-sidebar-collapsed";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(
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
        "hidden h-screen shrink-0 border-r border-slate-200/80 bg-white lg:flex lg:flex-col",
        "transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div
        className={clsx(
          "relative flex items-center border-b border-slate-200/80",
          collapsed ? "justify-center" : "justify-between"
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
              "flex h-8 w-8 items-center justify-center rounded-lg",
              "text-slate-500 transition-colors",
              "hover:bg-slate-100 hover:text-slate-900",
              collapsed
                ? "absolute -right-4 top-5 z-30 border border-slate-200 bg-white shadow-sm"
                : "mr-3"
            )}
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        )}
      </div>

      <div
        className={clsx(
          "min-h-0 flex-1 overflow-y-auto py-4",
          collapsed ? "px-2" : "px-3"
        )}
      >
        <Navigation collapsed={collapsed} />
      </div>

      <div
        className={clsx(
          "border-t border-slate-200/80",
          collapsed ? "p-2" : "p-3"
        )}
      >
        <UserProfile collapsed={collapsed} />

        <div className="mt-2">
          <LogoutButton collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}