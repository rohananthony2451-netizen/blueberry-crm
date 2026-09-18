"use client";

import { useEffect, useState } from "react";

import {
  createPayment as createPaymentService,
  deletePayment as deletePaymentService,
  getPayments,
  updatePayment as updatePaymentService,
} from "../services/payment.service";

import type { PaymentInput } from "../services/payment.service";
import type { Payment } from "../types";

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

  async function updatePayment(
    id: string,
    payment: PaymentInput
  ) {
    try {
      setError(null);

      const updatedPayment =
        await updatePaymentService(
          id,
          payment
        );

      setPayments((current) =>
        current.map((item) =>
          item.id === id
            ? updatedPayment
            : item
        )
      );

      return updatedPayment;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update payment.";

      setError(message);

      throw new Error(message);
    }
  }

  async function deletePayment(
    id: string
  ) {
    try {
      setError(null);

      await deletePaymentService(id);

      setPayments((current) =>
        current.filter(
          (payment) =>
            payment.id !== id
        )
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete payment.";

      setError(message);

      throw new Error(message);
    }
  }

  return {
    payments,
    loading,
    error,
    createPayment,
    updatePayment,
    deletePayment,
  };
}