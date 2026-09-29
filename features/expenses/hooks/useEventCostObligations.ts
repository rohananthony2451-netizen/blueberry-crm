
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getEventCostObligations } from "../services/eventCostObligation.service";
import type { EventCostObligation } from "../types";

export function useEventCostObligations() {
  const [obligations, setObligations] = useState<
    EventCostObligation[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getEventCostObligations();
      setObligations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load obligations."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    obligations,
    loading,
    error,
    refresh,
  };
}