
"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { CurrentUser } from "@/app/(dashboard)/layout";

interface AppShellProps {
  children: ReactNode;
  currentUser: CurrentUser;
}

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/quotations")) return "Quotations";
  if (pathname.startsWith("/clients")) return "Clients";
  if (pathname.startsWith("/leads")) return "Leads";
  if (pathname.startsWith("/events")) return "Events";
  if (pathname.startsWith("/payments")) return "Payments";
  if (pathname.startsWith("/expenses")) return "Expenses";
  if (pathname.startsWith("/vendors")) return "Vendors";
  if (pathname.startsWith("/vendor-entries")) return "Vendor Entries";
  if (pathname.startsWith("/reports")) return "Reports";

  return "Eventos";
}

export default function AppShell({
  children,
  currentUser,
}: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <Sidebar
        currentUser={currentUser}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={getPageTitle(pathname)}
          onToggleSidebar={() =>
            setMobileMenuOpen((open) => !open)
          }
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="min-w-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
