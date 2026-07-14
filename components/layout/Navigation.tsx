"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/constants/navigation";
import clsx from "clsx";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-8 px-3">
      {navigation.map((section) => (
        <div key={section.title}>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {section.title}
          </p>

          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;

              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
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