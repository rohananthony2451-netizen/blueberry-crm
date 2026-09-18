"use client";

import { useEffect, useState } from "react";

import {
  createPayment as createPaymentService,
  deletePayment as deletePaymentService,
  getPaymentSummary,
  getPayments,
  updatePayment as updatePaymentService,
} from "../services/payment.service";

import type { PaymentInput } from "../services/payment.service";
import type { Payment, PaymentSummary } from "../types";

const EMPTY_SUMMARY: PaymentSummary = {
  totalReceived: 0,
  thisMonthReceived: 0,
  pendingAmount: 0,
};

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] =
    useState<PaymentSummary>(EMPTY_SUMMARY);

  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] =
    useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true);
        setSummaryLoading(true);
        setError(null);

        const [paymentsData, summaryData] =
          await Promise.all([
            getPayments(),
            getPaymentSummary(),
          ]);

        setPayments(paymentsData);
        setSummary(summaryData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load payments."
        );
      } finally {
        setLoading(false);
        setSummaryLoading(false);
      }
    }

    loadPayments();
  }, []);

  async function createPayment(payment: PaymentInput) {
    try {
      setError(null);

      const createdPayment =
        await createPaymentService(payment);

      setPayments((current) => [
        createdPayment,
        ...current,
      ]);

      const updatedSummary =
        await getPaymentSummary();

      setSummary(updatedSummary);

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
        await updatePaymentService(id, payment);

      setPayments((current) =>
        current.map((item) =>
          item.id === id ? updatedPayment : item
        )
      );

      const updatedSummary =
        await getPaymentSummary();

      setSummary(updatedSummary);

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

  async function deletePayment(id: string) {
    try {
      setError(null);

      await deletePaymentService(id);

      setPayments((current) =>
        current.filter(
          (payment) => payment.id !== id
        )
      );

      const updatedSummary =
        await getPaymentSummary();

      setSummary(updatedSummary);
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
    summary,
    loading,
    summaryLoading,
    error,
    createPayment,
    updatePayment,
    deletePayment,
  };
}