import { createClient } from "@/lib/supabase/browser";

import { Event } from "../types";

export interface EventInput {
  eventName: string;
  clientId: string;
  eventType: string;
  eventDate: string;
  venue: string;
  status: Event["status"];
  guestCount: number;
}

interface EventRow {
  id: string;
  organization_id: string;
  client_id: string | null;
  client_name: string;
  event_name: string;
  event_type: string;
  event_date: string;
  venue: string;
  status: Event["status"];
  guest_count: number;
  created_at: string;
  updated_at: string;

  clients: {
    name: string;
  } | null;
}

function getDateBasedStatus(
  eventDate: string
): Event["status"] {
  // Use local calendar dates, not UTC timestamps.
  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const dateKey = eventDate.slice(0, 10);

  if (dateKey > todayKey) {
    return "Upcoming";
  }

  if (dateKey < todayKey) {
    return "Completed";
  }

  return "In Progress";
}

function mapEventRow(
  event: EventRow
): Event {
  return {
    id: event.id,
    clientId: event.client_id,
    clientName:
      event.clients?.name ??
      event.client_name,
    eventName: event.event_name,
    eventType: event.event_type,
    eventDate: event.event_date,
    venue: event.venue,
    status:
      event.status === "Cancelled"
        ? "Cancelled"
        : getDateBasedStatus(event.event_date),
    guestCount: event.guest_count,
  };
}

const EVENT_SELECT = `
  *,
  clients (
    name
  )
`;

export async function getEvents(): Promise<Event[]> {
  const supabase = createClient();

  const { data, error } =
    await supabase
      .from("events")
      .select(EVENT_SELECT)
      .order("event_date", {
        ascending: true,
      });

  if (error) {
    throw new Error(error.message);
  }

  return (data as EventRow[]).map(
    mapEventRow
  );
}

export async function createEvent(
  event: EventInput
): Promise<Event> {
  const supabase = createClient();

  const {
    data: organizationId,
    error: organizationError,
  } = await supabase.rpc(
    "get_user_organization_id"
  );

  if (organizationError) {
    throw new Error(
      organizationError.message
    );
  }

  if (!organizationId) {
    throw new Error(
      "No organization found for the current user."
    );
  }

  const {
    data: client,
    error: clientError,
  } = await supabase
    .from("clients")
    .select("id, name")
    .eq("id", event.clientId)
    .single();

  if (clientError) {
    throw new Error(
      clientError.message
    );
  }

  const { data, error } =
    await supabase
      .from("events")
      .insert({
        organization_id: organizationId,
        client_id: event.clientId,
        client_name: client.name,
        event_name: event.eventName,
        event_type: event.eventType,
        event_date: event.eventDate,
        venue: event.venue,
        status: event.status,
        guest_count: event.guestCount,
      })
      .select(EVENT_SELECT)
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapEventRow(
    data as EventRow
  );
}

export async function updateEvent(
  id: string,
  data: Partial<EventInput>
): Promise<Event> {
  const supabase = createClient();

  const updateData: Record<
    string,
    string | number | null
  > = {};

  if (data.eventName !== undefined) {
    updateData.event_name =
      data.eventName;
  }

  if (data.clientId !== undefined) {
    updateData.client_id =
      data.clientId;

    const {
      data: client,
      error: clientError,
    } = await supabase
      .from("clients")
      .select("name")
      .eq("id", data.clientId)
      .single();

    if (clientError) {
      throw new Error(
        clientError.message
      );
    }

    updateData.client_name =
      client.name;
  }

  if (data.eventType !== undefined) {
    updateData.event_type =
      data.eventType;
  }

  if (data.eventDate !== undefined) {
    updateData.event_date =
      data.eventDate;
  }

  if (data.venue !== undefined) {
    updateData.venue =
      data.venue;
  }

  if (data.status !== undefined) {
    updateData.status =
      data.status;
  }

  if (data.guestCount !== undefined) {
    updateData.guest_count =
      data.guestCount;
  }

  const {
    data: updatedData,
    error,
  } = await supabase
    .from("events")
    .update(updateData)
    .eq("id", id)
    .select(EVENT_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapEventRow(
    updatedData as EventRow
  );
}

/**
 * Change only the operational status of an event.
 *
 * The workflow is intentionally reversible:
 *
 * Upcoming -> In Progress
 * Upcoming -> Cancelled
 *
 * In Progress -> Completed
 * In Progress -> Cancelled
 *
 * Completed -> In Progress
 *
 * Cancelled -> Upcoming
 */
export async function updateEventStatus(
  id: string,
  nextStatus: Event["status"]
): Promise<Event> {
  const supabase = createClient();

  const {
    data: currentData,
    error: currentError,
  } = await supabase
    .from("events")
    .select("status")
    .eq("id", id)
    .single();

  if (currentError) {
    throw new Error(
      currentError.message
    );
  }

  const currentStatus =
    currentData.status as Event["status"];

  const allowedTransitions: Record<
    Event["status"],
    Event["status"][]
  > = {
    Upcoming: [
      "In Progress",
      "Cancelled",
    ],
    "In Progress": [
      "Completed",
      "Cancelled",
    ],
    Completed: [
      "In Progress",
    ],
    Cancelled: [
      "Upcoming",
    ],
  };

  const allowedNextStatuses =
    allowedTransitions[
      currentStatus
    ];

  if (
    !allowedNextStatuses.includes(
      nextStatus
    )
  ) {
    throw new Error(
      `Event cannot move from ${currentStatus} to ${nextStatus}.`
    );
  }

  const {
    error: updateError,
  } = await supabase
    .from("events")
    .update({
      status: nextStatus,
    })
    .eq("id", id)
    .eq("status", currentStatus);

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapEventRow(
    data as EventRow
  );
}

export async function deleteEvent(
  id: string
): Promise<void> {
  const supabase = createClient();

  const { error } =
    await supabase
      .from("events")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}