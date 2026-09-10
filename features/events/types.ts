export interface Event {
  id: string;
  eventName: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  venue: string;
  status: EventStatus;
  guestCount: number;
}

export type EventStatus =
  | "Upcoming"
  | "In Progress"
  | "Completed"
  | "Cancelled";