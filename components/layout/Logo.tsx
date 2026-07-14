import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 px-6 py-6"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
        <Sparkles size={20} />
      </div>

      <div>
        <h1 className="text-lg font-bold tracking-tight">
          Eventos
        </h1>

        <p className="text-xs text-muted-foreground">
          Event Management CRM
        </p>
      </div>
    </Link>
  );
}