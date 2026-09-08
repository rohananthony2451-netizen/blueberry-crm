"use client";

import {
  createLead as createLeadService,
  updateLead as updateLeadService,
  deleteLead as deleteLeadService,
} from "../services/lead.service";

import { Lead } from "../types";

export function useLeadActions() {
  async function createLead(
    lead: Omit<Lead, "id">
  ): Promise<Lead> {
    return await createLeadService(lead);
  }

  async function updateLead(
    id: string,
    lead: Partial<Lead>
  ): Promise<Lead> {
    return await updateLeadService(id, lead);
  }

  async function deleteLead(
    id: string
  ): Promise<void> {
    await deleteLeadService(id);
  }

  return {
    createLead,
    updateLead,
    deleteLead,
  };
}