"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/constants/navigation";
import clsx from "clsx";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-8">
      {navigation.map((section) => (
        <div key={section.title}>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {section.title}
          </p>

          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

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
      ))}
    </nav>
  );
}