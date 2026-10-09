
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import {
  bottomNavigation,
  navigation,
} from "@/constants/navigation";

import { createClient } from "@/lib/supabase/client";

type UserRole = "admin" | "staff" | null;

interface NavigationProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export default function Navigation({
  collapsed = false,
  onNavigate,
}: NavigationProps) {
  const pathname = usePathname();

  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRole() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (mounted) setRole(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      setRole(profile?.role === "admin" ? "admin" : "staff");
    }

    void loadRole();

    return () => {
      mounted = false;
    };
  }, []);

  function isActive(href: string) {
    return href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="flex h-full flex-col">
      <nav
        className={clsx(
          "flex flex-1 flex-col",
          collapsed ? "gap-2" : "gap-3"
        )}
      >
        {navigation.map((section) => {
          const visibleItems = section.items.filter(
            (item) =>
              !("adminOnly" in item) ||
              !item.adminOnly ||
              role === "admin"
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              {!collapsed && (
                <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {section.title}
                </p>
              )}

              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.title : undefined}
                      className={clsx(
                        "group flex items-center rounded-xl transition-colors duration-150",
                        collapsed
                          ? "mx-auto h-10 w-10 justify-center"
                          : "h-9 gap-2.5 px-2.5",
                        active
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      )}
                    >
                      <Icon
                        className={clsx(
                          "shrink-0",
                          active
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-600"
                        )}
                        size={18}
                        strokeWidth={active ? 2.2 : 1.9}
                      />

                      {!collapsed && (
                        <span
                          className={clsx(
                            "text-[13px] leading-5",
                            active ? "font-semibold" : "font-medium"
                          )}
                        >
                          {item.title}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div
        className={clsx(
          "border-t border-slate-100 pt-2",
          collapsed ? "mt-2" : "mt-3"
        )}
      >
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.title : undefined}
              className={clsx(
                "group flex items-center rounded-xl transition-colors duration-150",
                collapsed
                  ? "mx-auto h-10 w-10 justify-center"
                  : "h-9 gap-2.5 px-2.5",
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              )}
            >
              <Icon
                className={clsx(
                  "shrink-0",
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
                size={18}
                strokeWidth={active ? 2.2 : 1.9}
              />

              {!collapsed && (
                <span
                  className={clsx(
                    "text-[13px] leading-5",
                    active ? "font-semibold" : "font-medium"
                  )}
                >
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
