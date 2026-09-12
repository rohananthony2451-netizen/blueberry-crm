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