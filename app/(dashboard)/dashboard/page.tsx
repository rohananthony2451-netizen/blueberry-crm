import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { UpcomingEvents } from "@/features/dashboard/components/UpcomingEvents";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { QuickActions } from "@/features/dashboard/components/QuickActions";

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back to Eventos."
      />

      <DashboardStats />

      <DashboardCharts />

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingEvents />
        <RecentActivity />
      </div>

      <QuickActions />
    </PageContainer>
  );
}