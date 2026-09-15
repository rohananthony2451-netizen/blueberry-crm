"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getQuotations,
} from "../services/quotation.service";

import {
  Quotation,
} from "../types";

export function useQuotations() {
  const [
    quotations,
    setQuotations,
  ] = useState<Quotation[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuotations() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getQuotations();

        setQuotations(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load quotations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuotations();
  }, []);

  return {
    quotations,
    loading,
    error,
  };
}