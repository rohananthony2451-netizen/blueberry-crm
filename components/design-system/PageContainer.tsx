import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div className="min-h-full bg-slate-50 px-6 py-6 lg:px-8 lg:py-7">
      {children}
    </div>
  );
}