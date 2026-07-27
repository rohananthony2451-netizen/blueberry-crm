"use client";

import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";
import { LeadToolbar } from "@/features/leads/components/LeadToolbar";
import { LeadTable } from "@/features/leads/components/LeadTable";
import { LeadFilters } from "@/features/leads/components/LeadFilters";
import { useState } from "react";
import { mockLeads } from "@/features/leads/data/mock-leads";
export default function LeadsPage() {

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
        search === "" ||
        lead.clientName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
        status === "" ||
        lead.status === status;

    const matchesSource =
        source === "" ||
        lead.source === source;

    return (
        matchesSearch &&
        matchesStatus &&
        matchesSource
    );
});

  return (  
    <PageContainer>
         <PageHeader
        title="Leads"
        description="Manage all incoming event enquiries."
    />

<LeadToolbar
  search={search}
  onSearchChange={setSearch}
/>
    <LeadFilters
    search={search}
    status={status}
    source={source}
    onSearchChange={setSearch}
    onStatusChange={setStatus}
    onSourceChange={setSource}
    />

    <LeadTable
    leads={filteredLeads}
/>
    </PageContainer>
  );
}