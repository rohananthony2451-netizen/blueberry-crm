
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div className="min-h-full w-full bg-slate-50 px-4 py-4 sm:px-5 sm:py-5 xl:px-6 xl:py-6">
      {children}
    </div>
  );
}
 