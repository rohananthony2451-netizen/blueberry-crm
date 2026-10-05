"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { navigation } from "@/constants/navigation";
import { createClient } from "@/lib/supabase/client";

type UserRole = "admin" | "staff" | null;

export default function Navigation() {
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
        if (mounted) {
          setRole(null);
        }

        return;
      }

      const { data: profile } = await supabase
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

  return (
    <nav className="flex flex-col gap-8">
      {navigation.map((section) => {
        const visibleItems = section.items.filter(
            (item) =>
            !("adminOnly" in item) ||
            !item.adminOnly ||
            role === "admin"
          );

        if (visibleItems.length === 0) {
          return null;
        }

        return (
          <div key={section.title}>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {section.title}
            </p>

            <div className="space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;

                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname === item.href ||
                      pathname.startsWith(
                        `${item.href}/`
                      );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon size={18} />

                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}