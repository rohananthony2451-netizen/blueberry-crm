"use client";

import { useState } from "react";

import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";

import { EventTable } from "@/features/events/components/EventTable";
import { mockEvents } from "@/features/events/data/mock-events";

export default function EventsPage() {
  const [search, setSearch] = useState("");

  const filteredEvents = mockEvents.filter(
    (event) =>
      event.eventName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      event.clientName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      event.venue
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <PageHeader
        title="Events"
        description="Manage your upcoming and completed events."
      />

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search events..."
          className="w-full max-w-md rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2"
        />
      </div>

      <EventTable
        events={filteredEvents}
      />
    </PageContainer>
  );
}