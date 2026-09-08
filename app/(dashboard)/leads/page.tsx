"use client";

import { useState } from "react";

import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";

import { LeadToolbar } from "@/features/leads/components/LeadToolbar";
import { LeadTable } from "@/features/leads/components/LeadTable";
import { LeadFilters } from "@/features/leads/components/LeadFilters";

import { useLeads } from "@/features/leads/hooks/useLeads";
import { useLeadActions } from "@/features/leads/hooks/useLeadActions";
import { Lead } from "@/features/leads/types";
export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [sortBy, setSortBy] = useState("");

 const {
  leads,
  loading,
  createLead,
  updateLeadInState,
  removeLeadFromState,
} = useLeads();

const {
  updateLead,
  deleteLead,
} = useLeadActions();

async function handleUpdateLead(
  id: string,
  data: Partial<Lead>
) {
  const updatedLead = await updateLead(
    id,
    data
  );

  updateLeadInState(updatedLead);
}

async function handleDeleteLead(id: string) {
  await deleteLead(id);
  removeLeadFromState(id);
}
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      search === "" ||
      lead.clientName
        .toLowerCase()
        .includes(search.toLowerCase());

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

  const sortedLeads = [...filteredLeads];

  if (sortBy === "Client Name") {
    sortedLeads.sort((a, b) =>
      a.clientName.localeCompare(b.clientName)
    );
  }

  if (sortBy === "Budget") {
    sortedLeads.sort(
      (a, b) =>
        Number(b.budget) - Number(a.budget)
    );
  }

  if (sortBy === "Event Date") {
    sortedLeads.sort(
      (a, b) =>
        new Date(a.eventDate).getTime() -
        new Date(b.eventDate).getTime()
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Leads"
          description="Manage all incoming event enquiries."
        />

        <p className="text-muted-foreground">
          Loading leads...
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Leads"
        description="Manage all incoming event enquiries."
      />

      <LeadToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateLead={createLead}
      />

      <LeadFilters
        search={search}
        status={status}
        source={source}
        sortBy={sortBy}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSourceChange={setSource}
        onSortChange={setSortBy}
      />

    <LeadTable
  leads={sortedLeads}
  onEdit={handleUpdateLead}
  onDelete={handleDeleteLead}
/>
    </PageContainer>
  );
}