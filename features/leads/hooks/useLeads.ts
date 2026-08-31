"use client";

import { useEffect, useState } from "react";

import { getLeads } from "../services/lead.service";
import { Lead } from "../types";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLeads() {
    try {
      setLoading(true);
      setError("");

      const data = await getLeads();

      setLeads(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load leads."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  return {
    leads,
    loading,
    error,
    reload: loadLeads,
  };
}