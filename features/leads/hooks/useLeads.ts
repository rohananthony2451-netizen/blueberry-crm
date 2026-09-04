"use client";

import { useEffect, useState } from "react";

import {
  getLeads,
  createLead as createLeadService,
  updateLead as updateLeadService,
  deleteLead as deleteLeadService,
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

  async function createLead(lead: Omit<Lead, "id">) {
    const newLead = await createLeadService(lead);

    setLeads((currentLeads) => [
      newLead,
      ...currentLeads,
    ]);

    return newLead;
  }

  async function updateLead(
    id: string,
    lead: Partial<Lead>
  ) {
    const updatedLead = await updateLeadService(id, lead);

    setLeads((currentLeads) =>
      currentLeads.map((existingLead) =>
        existingLead.id === id
          ? updatedLead
          : existingLead
      )
    );

    return updatedLead;
  }

  async function deleteLead(id: string) {
    await deleteLeadService(id);

    setLeads((currentLeads) =>
      currentLeads.filter(
        (existingLead) => existingLead.id !== id
      )
    );
  }

  return {
    leads,
    loading,
    createLead,
    updateLead,
    deleteLead,
  };
}