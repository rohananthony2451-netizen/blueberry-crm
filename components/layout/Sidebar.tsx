
"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import clsx from "clsx";

import Logo from "./Logo";
import Navigation from "./Navigation";
import UserProfile from "./UserProfile";
import LogoutButton from "@/components/shared/LogoutButton";
import { CurrentUser } from "@/app/(dashboard)/layout";

const SIDEBAR_STORAGE_KEY = "eventify-sidebar-collapsed";

interface SidebarProps {
  currentUser: CurrentUser;
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  currentUser,
  mobileOpen,
  onClose,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(
      SIDEBAR_STORAGE_KEY
    );

    setCollapsed(saved === "true");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, onClose]);

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
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        id="app-sidebar"
        aria-label="Main navigation"
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-[280px] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:relative lg:inset-auto lg:h-screen lg:shrink-0 lg:translate-x-0 lg:shadow-none lg:transition-[width]",
          collapsed ? "lg:w-[68px]" : "lg:w-[248px]"
        )}
      >
        <div
          className={clsx(
            "relative flex h-16 shrink-0 items-center justify-between border-b border-slate-100",
            collapsed && "lg:justify-center"
          )}
        >
          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="hidden lg:block">
            {collapsed ? <Logo collapsed /> : <Logo />}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={19} />
          </button>

          {mounted && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={clsx(
                "hidden h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:flex",
                collapsed
                  ? "absolute -right-3.5 top-[18px] z-30 border border-slate-200 bg-white shadow-sm"
                  : "mr-3"
              )}
            >
              {collapsed ? (
                <ChevronRight size={15} strokeWidth={2} />
              ) : (
                <ChevronLeft size={15} strokeWidth={2} />
              )}
            </button>
          )}
        </div>

        <div
          className={clsx(
            "min-h-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent",
            collapsed ? "px-2 py-3" : "px-2.5 py-3"
          )}
        >
          <Navigation
            collapsed={collapsed}
              onNavigate={onClose}
/>
        </div>

        <div className="shrink-0 border-t border-slate-100 bg-white p-2.5">
          <UserProfile
            collapsed={collapsed}
             currentUser={currentUser}
/>
<LogoutButton collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}
