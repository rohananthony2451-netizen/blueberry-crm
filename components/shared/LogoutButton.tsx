"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { createClient } from "@/lib/supabase/client";

interface LogoutButtonProps {
  collapsed?: boolean;
}

export default function LogoutButton({
  collapsed = false,
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      setLoading(false);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      title={
        collapsed
          ? loading
            ? "Signing out..."
            : "Sign out"
          : undefined
      }
      className={clsx(
        "flex w-full items-center rounded-lg text-sm font-medium text-slate-600 transition",
        "hover:bg-slate-100 hover:text-slate-900",
        "disabled:cursor-not-allowed disabled:opacity-50",
        collapsed
          ? "h-10 justify-center px-2"
          : "gap-2 px-3 py-2 text-left"
      )}
    >
      <LogOut size={17} />

      {!collapsed && (
        <span>
          {loading ? "Signing out..." : "Sign out"}
        </span>
      )}
    </button>
  );
}