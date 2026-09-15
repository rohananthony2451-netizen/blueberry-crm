"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createQuotation as createQuotationService,
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

  async function createQuotation(
    quotation: {
      clientId: string;
      eventId: string | null;
      quotationDate: string;
      validUntil: string | null;
      discount: number;
      tax: number;
      notes: string;
      items: {
        description: string;
        quantity: number;
        unitPrice: number;
        amount: number;
      }[];
    }
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

  return {
    quotations,
    loading,
    error,
    createQuotation,
  };
}