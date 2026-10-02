
import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";
import { DashboardContent } from "@/features/dashboard/components/DashboardContent";
import { QuickActions } from "@/features/dashboard/components/QuickActions";

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back to Eventos."
      />
      <DashboardContent />
      <QuickActions />
    </PageContainer>
  );
}
