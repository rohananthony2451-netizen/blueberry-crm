import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div className="space-y-8 bg-slate-50 p-8 min-h-screen">
      {children}
    </div>
  );
}