"use client";

import {
  useEffect,
  useState,
} from "react";

import { PageContainer } from "@/components/design-system/PageContainer";

import { LeadDialog } from "@/features/leads/components/LeadDialog";
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
  const PAGE_SIZE = 8;

const [currentPage, setCurrentPage] =
  useState(1);

  useEffect(() => {
  setCurrentPage(1);
}, [
  search,
  status,
  source,
  sortBy,
]);

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
    const updatedLead =
      await updateLead(id, data);

    updateLeadInState(updatedLead);
  }

  async function handleDeleteLead(
    id: string
  ) {
    await deleteLead(id);
    removeLeadFromState(id);
  }

  const filteredLeads = leads.filter(
    (lead) => {
      const normalizedSearch =
        search.toLowerCase().trim();

      const matchesSearch =
        normalizedSearch === "" ||
        lead.clientName
          .toLowerCase()
          .includes(normalizedSearch) ||
        lead.email
          .toLowerCase()
          .includes(normalizedSearch) ||
        lead.phone
          .toLowerCase()
          .includes(normalizedSearch);

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
    }
  );

  const sortedLeads = [...filteredLeads];

  if (sortBy === "Client Name") {
    sortedLeads.sort((a, b) =>
      a.clientName.localeCompare(
        b.clientName
      )
    );
  }

  if (sortBy === "Budget") {
    sortedLeads.sort(
      (a, b) =>
        Number(b.budget) -
        Number(a.budget)
    );
  }

  if (sortBy === "Event Date") {
    sortedLeads.sort(
      (a, b) =>
        new Date(
          a.eventDate
        ).getTime() -
        new Date(
          b.eventDate
        ).getTime()
    );
  }

  const totalItems =
  sortedLeads.length;

const totalPages = Math.max(
  1,
  Math.ceil(
    totalItems / PAGE_SIZE
  )
);

const safeCurrentPage = Math.min(
  currentPage,
  totalPages
);

const paginatedLeads =
  sortedLeads.slice(
    (safeCurrentPage - 1) *
      PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

  if (loading) {
    return (
      <PageContainer>
        <div className="mb-5">
          <h1 className="text-[25px] font-bold tracking-tight text-slate-950">
            Leads
          </h1>

          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage and convert your event enquiries.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm font-medium text-slate-500 shadow-sm">
          Loading leads...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Page header */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-[27px] font-bold leading-tight tracking-tight text-slate-950">
            Leads
          </h1>

          <p className="mt-1 text-[14px] font-medium text-slate-500">
            Manage and convert your event enquiries.
          </p>
        </div>

        <LeadDialog
          onCreateLead={createLead}
          triggerClassName="h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-sm hover:bg-blue-700"
        />
      </div>

      {/* Search + filters */}
      <div className="mb-4 flex min-h-[58px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <LeadToolbar
          search={search}
          onSearchChange={setSearch}
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
      </div>

      {/* Table */}
      <LeadTable
  leads={paginatedLeads}
  currentPage={safeCurrentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  pageSize={PAGE_SIZE}
  onPageChange={setCurrentPage}
  onEdit={handleUpdateLead}
  onDelete={handleDeleteLead}
/>
    </PageContainer>
  );
}