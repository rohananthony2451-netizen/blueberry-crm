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
}

export default function Navigation({
  collapsed = false,
}: NavigationProps) {
  const pathname = usePathname();

  const [role, setRole] =
    useState<UserRole>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRole() {
      const supabase = createClient();

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        if (mounted) {
          setRole(null);
        }

        return;
      }

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

      if (!mounted) {
        return;
      }

      setRole(
        profile?.role === "admin"
          ? "admin"
          : "staff"
      );
    }

    void loadRole();

    return () => {
      mounted = false;
    };
  }, []);

  function isActive(href: string) {
    return href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href ||
          pathname.startsWith(`${href}/`);
  }

  return (
    <div className="flex h-full flex-col">
      <nav
        className={clsx(
          "flex flex-1 flex-col",
          collapsed ? "gap-3" : "gap-6"
        )}
      >
        {navigation.map((section) => {
          const visibleItems =
            section.items.filter(
              (item) =>
                !("adminOnly" in item) ||
                !item.adminOnly ||
                role === "admin"
            );

          if (
            visibleItems.length === 0
          ) {
            return null;
          }

          return (
            <div
              key={section.title}
            >
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {visibleItems.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    const active =
                      isActive(
                        item.href
                      );

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={
                          collapsed
                            ? item.title
                            : undefined
                        }
                        className={clsx(
                          "group flex items-center rounded-xl transition-all duration-150",
                          collapsed
                            ? "mx-auto h-10 w-10 justify-center"
                            : "h-10 gap-3 px-3",
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
                          strokeWidth={
                            active ? 2.2 : 1.9
                          }
                        />

                        {!collapsed && (
                          <span
                            className={clsx(
                              "text-[14px]",
                              active
                                ? "font-semibold"
                                : "font-medium"
                            )}
                          >
                            {item.title}
                          </span>
                        )}
                      </Link>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
      </nav>

      <div
        className={clsx(
          "border-t border-slate-100 pt-3",
          collapsed
            ? "mt-3"
            : "mt-4"
        )}
      >
        {bottomNavigation.map(
          (item) => {
            const Icon = item.icon;
            const active =
              isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={
                  collapsed
                    ? item.title
                    : undefined
                }
                className={clsx(
                  "group flex items-center rounded-xl transition-all duration-150",
                  collapsed
                    ? "mx-auto h-10 w-10 justify-center"
                    : "h-10 gap-3 px-3",
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
                  strokeWidth={
                    active ? 2.2 : 1.9
                  }
                />

                {!collapsed && (
                  <span
                    className={clsx(
                      "text-[14px]",
                      active
                        ? "font-semibold"
                        : "font-medium"
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}