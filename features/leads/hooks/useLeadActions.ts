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
  ) {
    await createLeadService(lead);
  }

  async function updateLead(
    id: string,
    lead: Partial<Lead>
  ) {
    await updateLeadService(id, lead);
  }

  async function deleteLead(
    id: string
  ) {
    await deleteLeadService(id);
  }

  return {
    createLead,
    updateLead,
    deleteLead,
  };
}