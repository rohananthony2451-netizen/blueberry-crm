import { LEAD_SOURCES, LEAD_STATUS } from "../constants";

export interface LeadFormValues {
  clientName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  budget: string;
  source: (typeof LEAD_SOURCES)[number] | "";
  assignedTo: string;
  notes: string;
}