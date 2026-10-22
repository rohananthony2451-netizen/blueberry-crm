
"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";
import { EventDialog } from "@/features/events/components/EventDialog";
import { EventTable } from "@/features/events/components/EventTable";
import { useEvents } from "@/features/events/hooks/useEvents";
import type { Event } from "@/features/events/types";
import type { EventFormValues } from "@/features/events/validation";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const {
    events,
    loading,
    error,
    createEvent,
    editEvent,
    updateEventStatus,
    removeEvent,
  } = useEvents();

  const canDeleteRecords = userRole === "admin";

  useEffect(() => {
    let active = true;

    async function loadUserRole() {
      try {
        const supabase = createSupabaseClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (active) setUserRole(null);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (!active) return;

        if (profileError) {
          console.error("Failed to load user role:", profileError);
          setUserRole(null);
        } else {
          setUserRole(profile?.role ?? null);
        }
      } catch (err) {
        console.error("Failed to load user role:", err);
        if (active) setUserRole(null);
      }
    }

    void loadUserRole();

    return () => {
      active = false;
    };
  }, []);

  const filteredEvents = events.filter((event) => {
    const query = search.trim().toLowerCase();

    return (
      event.eventName.toLowerCase().includes(query) ||
      event.clientName.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query)
    );
  });

  async function handleCreateEvent(data: EventFormValues) {
    await createEvent({
      eventName: data.eventName,
      clientId: data.clientId,
      eventType: data.eventType,
      eventDate: data.eventDate,
      venue: data.venue,
      guestCount: Number(data.guestCount),
      status: "Upcoming",
    });
  }

  async function handleEditEvent(id: string, data: Partial<Event>) {
    await editEvent(id, {
      eventName: data.eventName,
      clientId: data.clientId ?? undefined,
      eventType: data.eventType,
      eventDate: data.eventDate,
      venue: data.venue,
      guestCount: data.guestCount,
      status: data.status,
    });
  }

  async function handleDeleteEvent(id: string) {
    setDeleteWarning(null);

    try {
      await removeEvent(id);
    } catch (err) {
      const message = err instanceof Error ? err.message.toLowerCase() : "";

      if (message.includes("linked payments")) {
        setDeleteWarning(
          "This event cannot be deleted because it has linked payments. Resolve its payment history first."
        );
      } else if (message.includes("vendor entries")) {
        setDeleteWarning(
          "This event cannot be deleted because it has vendor entries. Resolve those entries first."
        );
      } else if (message.includes("quotation")) {
        setDeleteWarning(
          "This event cannot be deleted because it has linked quotations. Resolve those quotations first."
        );
      } else if (message.includes("cost obligation")) {
        setDeleteWarning(
          "This event cannot be deleted because it has linked cost obligations. Resolve those obligations first."
        );
      } else {
        console.error("Event deletion failed:", err);
        setDeleteWarning(
          "We couldn't delete this event right now. Please try again. If the problem continues, contact support."
        );
      }
    }
  }

  async function handleStatusChange(
    id: string,
    status: Event["status"]
  ): Promise<void> {
    await updateEventStatus(id, status);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Events"
        description="Manage your upcoming and completed events."
      />

      
  {deleteWarning && (
    <div
      role="alert"
      className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-sm text-amber-950 shadow-sm"
    >
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
        <span aria-hidden="true" className="text-base">!</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold">Event can't be deleted</p>
        <p className="mt-1 leading-5 text-amber-900/90">
          {deleteWarning}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setDeleteWarning(null)}
        className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-amber-900/70 transition hover:bg-amber-100 hover:text-amber-950"
        aria-label="Dismiss warning"
      >
        Dismiss
      </button>
    </div>
  )}


      <div className="mb-6 flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search events..."
          aria-label="Search events"
          className="w-full max-w-md rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2"
        />

        <EventDialog onCreateEvent={handleCreateEvent} />
      </div>

      {loading && (
        <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
          Loading events...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
          Failed to load events: {error}
        </div>
      )}

      {!loading && !error && (
        <EventTable
          events={filteredEvents}
          onEdit={handleEditEvent}
          onDelete={canDeleteRecords ? handleDeleteEvent : undefined}
          onStatusChange={handleStatusChange}
          canDelete={canDeleteRecords}
        />
      )}
    </PageContainer>
  );
}
