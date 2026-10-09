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
        collapsed
          ? "Eventos"
          : undefined
      }
      className={
        collapsed
          ? "flex items-center justify-center"
          : "flex min-w-0 items-center gap-2.5 px-4"
      }
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
        <Sparkles
          size={17}
          strokeWidth={2.1}
        />
      </div>

      {!collapsed && (
        <div className="min-w-0">
          <h1 className="truncate text-[16px] font-bold tracking-tight text-slate-950">
            Eventos
          </h1>

          <p className="truncate text-[10px] font-medium text-slate-400">
            Event Management CRM
          </p>
        </div>
      )}
    </Link>
  );
}