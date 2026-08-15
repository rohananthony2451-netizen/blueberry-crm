import { mockLeads } from "../data/mock-leads";
import { Lead } from "../types";

export async function getLeads(): Promise<Lead[]> {
    return Promise.resolve(mockLeads);
}