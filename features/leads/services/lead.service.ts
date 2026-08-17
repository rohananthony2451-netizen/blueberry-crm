import { mockLeads } from "../data/mock-leads";
import { Lead } from "../types";

export async function getLeads(): Promise<Lead[]> {
  return Promise.resolve(mockLeads);
}

export async function createLead(
  lead: Omit<Lead, "id">
): Promise<void> {
  console.log("Service Create", lead);
}

export async function updateLead(
  id: string,
  lead: Partial<Lead>
): Promise<void> {
  console.log("Service Update", id, lead);
}

export async function deleteLead(
  id: string
): Promise<void> {
  console.log("Service Delete", id);
}