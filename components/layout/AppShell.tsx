import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header title="Dashboard" />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}