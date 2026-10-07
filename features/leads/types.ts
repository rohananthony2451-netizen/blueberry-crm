import { LEAD_STATUS, LEAD_SOURCES } from "./constants";

export interface Lead {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  budget: string;
  source: (typeof LEAD_SOURCES)[number] | "";
  status: (typeof LEAD_STATUS)[number];
  followUpDate: string;
  assignedTo: string;
  assignedToName?: string;
  notes: string;
  convertedClientId: string | null;
}