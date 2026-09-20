"use client";

import { useState } from "react";

import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";

import { EventDialog } from "@/features/events/components/EventDialog";
import { EventTable } from "@/features/events/components/EventTable";

import { useEvents } from "@/features/events/hooks/useEvents";

import type { Event } from "@/features/events/types";
import type { EventFormValues } from "@/features/events/validation";

export default function EventsPage() {
  const [search, setSearch] =
    useState("");

  const {
    events,
    loading,
    error,
    createEvent,
    editEvent,
    removeEvent,
  } = useEvents();

  async function handleCreateEvent(
    data: EventFormValues
  ) {
    await createEvent({
      eventName: data.eventName,
      clientId: data.clientId,
      eventType: data.eventType,
      eventDate: data.eventDate,
      venue: data.venue,
      guestCount: Number(
        data.guestCount
      ),
      status: "Upcoming",
    });
  }

  async function handleEditEvent(
    id: string,
    data: Partial<Event>
  ) {
    await editEvent(id, {
      eventName: data.eventName,
      clientId:
        data.clientId ?? undefined,
      eventType: data.eventType,
      eventDate: data.eventDate,
      venue: data.venue,
      guestCount: data.guestCount,
      status: data.status,
    });
  }

  async function handleDeleteEvent(
    id: string
  ) {
    await removeEvent(id);
  }

  const filteredEvents =
    events.filter((event) =>
      event.eventName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      event.clientName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      event.venue
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
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
            setSearch(
              event.target.value
            )
          }
          placeholder="Search events..."
          className="w-full max-w-md rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2"
        />

        <EventDialog
          onCreateEvent={
            handleCreateEvent
          }
        />
      </div>

      {loading && (
        <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
          Loading events...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
          Failed to load events:{" "}
          {error}
        </div>
      )}

      {!loading && !error && (
        <EventTable
          events={filteredEvents}
          onEdit={handleEditEvent}
          onDelete={
            handleDeleteEvent
          }
        />
      )}
    </PageContainer>
  );
}