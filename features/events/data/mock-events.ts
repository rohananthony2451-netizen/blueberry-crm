import { Event } from "../types";

export const mockEvents: Event[] = [
  {
    id: "event-1",
    eventName: "Sharma Wedding",
    clientName: "Rahul Sharma",
    eventType: "Wedding",
    eventDate: "2026-10-18",
    venue: "Taj Hotel",
    status: "Upcoming",
    guestCount: 350,
  },
  {
    id: "event-2",
    eventName: "Aarav Birthday",
    clientName: "Neha Kapoor",
    eventType: "Birthday",
    eventDate: "2026-09-25",
    venue: "The Grand Palace",
    status: "Upcoming",
    guestCount: 120,
  },
  {
    id: "event-3",
    eventName: "TechCorp Annual Meet",
    clientName: "TechCorp India",
    eventType: "Corporate",
    eventDate: "2026-08-20",
    venue: "City Convention Centre",
    status: "Completed",
    guestCount: 500,
  },
];