"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getClient360,
  type Client360Data,
} from "../services/client360.service";

interface UseClient360Result {
  data: Client360Data | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useClient360(
  clientId: string | null
): UseClient360Result {
  const [data, setData] =
    useState<Client360Data | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadClient360 =
    useCallback(async () => {
      if (!clientId) {
        setData(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result =
          await getClient360(clientId);

        setData(result);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load client information.";

        setError(message);
      } finally {
        setLoading(false);
      }
    }, [clientId]);

  useEffect(() => {
    void loadClient360();
  }, [loadClient360]);

  return {
    data,
    loading,
    error,
    refresh: loadClient360,
  };
}