"use client";

import Logo from "./Logo";
import Navigation from "./Navigation";
import UserProfile from "./UserProfile";
import LogoutButton from "@/components/shared/LogoutButton";

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-slate-200/80 bg-white lg:flex lg:flex-col">

      <Logo />

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <Navigation />
      </div>

      <div className="border-t border-slate-200/80 p-3">
        <UserProfile />

        <div className="mt-2">
          <LogoutButton />
        </div>
      </div>

    </aside>
  );
}