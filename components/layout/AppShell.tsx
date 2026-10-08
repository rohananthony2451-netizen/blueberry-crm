import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { CurrentUser } from "@/app/(dashboard)/layout";

interface AppShellProps {
  children: ReactNode;
  currentUser: CurrentUser;
}

export default function AppShell({
  children,
  currentUser,
}: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar currentUser={currentUser} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}