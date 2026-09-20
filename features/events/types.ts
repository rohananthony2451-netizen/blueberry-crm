export type EventStatus =
  | "Upcoming"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export interface Event {
  id: string;
  clientId: string | null;
  clientName: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  venue: string;
  status: EventStatus;
  guestCount: number;
}

export type EventFormValues = {
  eventName: string;
  clientId: string;
  eventType: string;
  eventDate: string;
  venue: string;
  guestCount: string;
};