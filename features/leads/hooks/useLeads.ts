"use client";

import { useEffect, useState } from "react";

import {
  getLeads,
  createLead as createLeadService,
} from "../services/lead.service";

import { Lead } from "../types";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getLeads();
        setLeads(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function createLead(
    lead: Omit<Lead, "id">
  ): Promise<Lead> {
    const newLead = await createLeadService(lead);

    setLeads((currentLeads) => [
      newLead,
      ...currentLeads,
    ]);

    return newLead;
  }

  function addLeadToState(lead: Lead) {
    setLeads((currentLeads) => [
      lead,
      ...currentLeads,
    ]);
  }

  function updateLeadInState(updatedLead: Lead) {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === updatedLead.id
          ? updatedLead
          : lead
      )
    );
  }

  function removeLeadFromState(id: string) {
    setLeads((currentLeads) =>
      currentLeads.filter(
        (lead) => lead.id !== id
      )
    );
  }

  return {
    leads,
    loading,
    createLead,
    addLeadToState,
    updateLeadInState,
    removeLeadFromState,
  };
}