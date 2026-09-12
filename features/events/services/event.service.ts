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

  return (data as EventRow[]).map(
    (event) => ({
      id: event.id,
      eventName: event.event_name,
      clientName: event.client_name,
      eventType: event.event_type,
      eventDate: event.event_date,
      venue: event.venue,
      status: event.status,
      guestCount: event.guest_count,
    })
  );
}

export async function createEvent(
  event: Omit<Event, "id">
): Promise<Event> {
  const supabase = createClient();

  const { data: organizationId, error: organizationError } =
    await supabase.rpc("get_user_organization_id");

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

  const createdEvent = data as EventRow;

  return {
    id: createdEvent.id,
    eventName: createdEvent.event_name,
    clientName: createdEvent.client_name,
    eventType: createdEvent.event_type,
    eventDate: createdEvent.event_date,
    venue: createdEvent.venue,
    status: createdEvent.status,
    guestCount: createdEvent.guest_count,
  };
}