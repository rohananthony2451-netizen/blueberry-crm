
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Palette,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { ReactNode } from "react";

const settingsNavigation = [
  {
    label: "Company Profile",
    href: "/settings/company",
    description: "Business information",
    icon: Building2,
  },
  {
    label: "Users & Roles",
    href: "/settings/users",
    description: "Members and access",
    icon: Users,
  },
  {
    label: "Branding",
    href: "/settings/branding",
    description: "Workspace identity",
    icon: Palette,
  },
];

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full max-w-[1240px] min-w-0">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">
          Workspace
        </p>

        <h1 className="mt-1 text-[26px] font-bold tracking-[-0.025em] text-slate-950">
          Settings
        </h1>

        <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-slate-500">
          Manage your workspace, team access, and organization
          preferences.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <nav
            aria-label="Settings navigation"
            className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
          >
            <div className="hidden px-3 pb-1.5 pt-1 lg:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                General
              </p>
            </div>

            <div className="flex gap-1 overflow-x-auto lg:flex-col">
              {settingsNavigation.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "group flex min-h-11 min-w-0 shrink-0 items-center gap-2 rounded-lg px-2.5 transition-colors duration-150",
                      "max-sm:flex-1 max-sm:justify-center",
                      "lg:min-h-[56px] lg:shrink lg:justify-start",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        active
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      <Icon
                        size={16}
                        strokeWidth={active ? 2.2 : 1.9}
                      />
                    </div>

                    <div className="min-w-0 lg:block">
                      <p
                        className={clsx(
                          "text-[13px] leading-4",
                          active ? "font-bold" : "font-semibold"
                        )}
                      >
                        {item.label}
                      </p>

                      <p
                        className={clsx(
                          "mt-0.5 hidden truncate text-[10px] leading-3.5 sm:block",
                          active
                            ? "text-blue-600/70"
                            : "text-slate-400"
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        <section className="min-w-0">
          {children}
        </section>
      </div>
    </div>
  );
}
