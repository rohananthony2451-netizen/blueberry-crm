"use client";

import Logo from "./Logo";
import Navigation from "./Navigation";
import UserProfile from "./UserProfile";

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-72 border-r bg-white lg:flex lg:flex-col">
      <Logo />

      <div className="flex-1 overflow-y-auto py-4">
        <Navigation />
      </div>

      <UserProfile />
    </aside>
  );
}