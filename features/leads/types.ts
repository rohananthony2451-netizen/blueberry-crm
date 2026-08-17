import { LEAD_STATUS } from "./constants";
import { LEAD_SOURCES } from "./constants";
export interface Lead {
  id: string;
  clientName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  budget: string;
  source: (typeof LEAD_SOURCES)[number] | "";
  status: (typeof LEAD_STATUS)[number];
  assignedTo: string;
  notes: string;
}