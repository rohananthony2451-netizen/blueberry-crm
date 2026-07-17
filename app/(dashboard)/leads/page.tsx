import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";
import { LeadToolbar } from "@/features/leads/components/LeadToolbar";
import { LeadTable } from "@/features/leads/components/LeadTable";

export default function LeadsPage() {
  return (
    <PageContainer>
         <PageHeader
        title="Leads"
        description="Manage all incoming event enquiries."
    />

    <LeadToolbar />

    <LeadTable />
    </PageContainer>
  );
}