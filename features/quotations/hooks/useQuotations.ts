"use client";

import { useEffect, useState } from "react";

import {
  createQuotation as createQuotationService,
  getQuotations,
  updateQuotation as updateQuotationService,
} from "../services/quotation.service";

import type {
  Quotation,
} from "../types";

import type {
  QuotationInput,
} from "../services/quotation.service";

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

  async function createQuotation(
    quotation: QuotationInput
  ) {
    try {
      setError(null);

      const createdQuotation =
        await createQuotationService(
          quotation
        );

      setQuotations(
        (current) => [
          createdQuotation,
          ...current,
        ]
      );

      return createdQuotation;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create quotation.";

      setError(message);

      throw new Error(message);
    }
  }

  async function updateQuotation(
    id: string,
    quotation: QuotationInput
  ) {
    try {
      setError(null);

      const updatedQuotation =
        await updateQuotationService(
          id,
          quotation
        );

      setQuotations(
        (current) =>
          current.map(
            (item) =>
              item.id === id
                ? updatedQuotation
                : item
          )
      );

      return updatedQuotation;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update quotation.";

      setError(message);

      throw new Error(message);
    }
  }

  return {
    quotations,
    loading,
    error,
    createQuotation,
    updateQuotation,
  };
}