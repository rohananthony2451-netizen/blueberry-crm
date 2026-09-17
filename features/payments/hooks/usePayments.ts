"use client";

import { useEffect, useState } from "react";

import {
  createPayment as createPaymentService,
  getPayments,
} from "../services/payment.service";

import type { Payment } from "../types";

import type { PaymentInput } from "../services/payment.service";

export function usePayments() {
  const [
    payments,
    setPayments,
  ] = useState<Payment[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getPayments();

        setPayments(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load payments."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  async function createPayment(
    payment: PaymentInput
  ) {
    try {
      setError(null);

      const createdPayment =
        await createPaymentService(
          payment
        );

      setPayments((current) => [
        createdPayment,
        ...current,
      ]);

      return createdPayment;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create payment.";

      setError(message);

      throw new Error(message);
    }
  }

  return {
    payments,
    loading,
    error,
    createPayment,
  };
}