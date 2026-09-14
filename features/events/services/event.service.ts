import { createClient } from "@/lib/supabase/browser";

import { Event } from "../types";

interface EventRow {
  id: string;
  organization_id: string;
  event_name: string;
  client_name: string;
  event_type: string;
  event_date: string;
  venue: string;
  status: Event["status"];
  guest_count: number;
  created_at: string;
  updated_at: string;
}

function mapEventRow(
  event: EventRow
): Event {
  return {
    id: event.id,
    eventName: event.event_name,
    clientName: event.client_name,
    eventType: event.event_type,
    eventDate: event.event_date,
    venue: event.venue,
    status: event.status,
    guestCount: event.guest_count,
  };
}

export async function getEvents(): Promise<Event[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as EventRow[]).map(mapEventRow);
}

export async function createEvent(
  event: Omit<Event, "id">
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

  const { data, error } = await supabase
    .from("events")
    .insert({
      organization_id: organizationId,
      event_name: event.eventName,
      client_name: event.clientName,
      event_type: event.eventType,
      event_date: event.eventDate,
      venue: event.venue,
      status: event.status,
      guest_count: event.guestCount,
    })
    .select()
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
  data: Partial<Omit<Event, "id">>
): Promise<Event> {
  const supabase = createClient();

  const updateData: Record<
    string,
    string | number
  > = {};

  if (data.eventName !== undefined) {
    updateData.event_name =
      data.eventName;
  }

  if (data.clientName !== undefined) {
    updateData.client_name =
      data.clientName;
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
    updateData.venue = data.venue;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (data.guestCount !== undefined) {
    updateData.guest_count =
      data.guestCount;
  }

  const { data: updatedData, error } =
    await supabase
      .from("events")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapEventRow(
    updatedData as EventRow
  );
}
export async function deleteEvent(
  id: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}