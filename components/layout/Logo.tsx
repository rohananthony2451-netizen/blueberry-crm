import Link from "next/link";
import { Sparkles } from "lucide-react";

interface LogoProps {
  collapsed?: boolean;
}

export default function Logo({
  collapsed = false,
}: LogoProps) {
  return (
    <Link
      href="/dashboard"
      title={collapsed ? "Eventos" : undefined}
      className={
        collapsed
          ? "flex items-center justify-center p-4"
          : "flex items-center gap-3 px-6 py-6"
      }
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
        <Sparkles size={19} />
      </div>

      {!collapsed && (
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight">
            Eventos
          </h1>

          <p className="truncate text-xs text-muted-foreground">
            Event Management CRM
          </p>
        </div>
      )}
    </Link>
  );
}