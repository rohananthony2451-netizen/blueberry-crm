"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createManualExpense,
  deleteManualExpense,
  getManualExpenses,
  updateManualExpense,
} from "../services/manualExpense.service";
import type {
  ManualExpense,
  ManualExpenseInput,
} from "../manual-expense.types";

export function useManualExpenses() {
  const [expenses, setExpenses] = useState<ManualExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setExpenses(await getManualExpenses());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load expenses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function addExpense(input: ManualExpenseInput) {
    const created = await createManualExpense(input);
    setExpenses((current) => [created, ...current]);
    return created;
  }

  async function editExpense(id: string, input: ManualExpenseInput) {
    const updated = await updateManualExpense(id, input);
    setExpenses((current) =>
      current.map((expense) => (expense.id === id ? updated : expense))
    );
    return updated;
  }

  async function removeExpense(id: string) {
    await deleteManualExpense(id);
    setExpenses((current) =>
      current.filter((expense) => expense.id !== id)
    );
  }

  return {
    expenses,
    loading,
    error,
    refresh,
    addExpense,
    editExpense,
    removeExpense,
  };
}