import { ReactNode } from "react";

import SettingsLayout from "@/features/settings/components/SettingsLayout";

export default function SettingsRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SettingsLayout>{children}</SettingsLayout>;
}