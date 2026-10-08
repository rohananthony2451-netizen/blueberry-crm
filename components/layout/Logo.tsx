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
      title={
        collapsed ? "Eventos" : undefined
      }
      className={
        collapsed
          ? "flex items-center justify-center"
          : "flex min-w-0 items-center gap-3 px-5"
      }
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
        <Sparkles
          size={18}
          strokeWidth={2.1}
        />
      </div>

      {!collapsed && (
        <div className="min-w-0">
          <h1 className="truncate text-[17px] font-bold tracking-tight text-slate-950">
            Eventos
          </h1>

          <p className="truncate text-[11px] font-medium text-slate-400">
            Event Management CRM
          </p>
        </div>
      )}
    </Link>
  );
}