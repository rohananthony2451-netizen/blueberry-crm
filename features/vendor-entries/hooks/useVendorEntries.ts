"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createVendorEntry as createRecord,
  deleteVendorEntry as deleteRecord,
  getVendorEntries,
  updateVendorEntry as updateRecord,
} from "../services/vendorEntry.service";
import type { VendorEntry, VendorEntryFormValues } from "../types";

export function useVendorEntries() {
  const [entries, setEntries] = useState<VendorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setEntries(await getVendorEntries());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load vendor entries."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function addEntry(values: VendorEntryFormValues) {
    const entry = await createRecord(values);
    setEntries((current) => [entry, ...current]);
    return entry;
  }

  async function editEntry(id: string, values: VendorEntryFormValues) {
    const entry = await updateRecord(id, values);
    setEntries((current) =>
      current.map((item) => (item.id === id ? entry : item))
    );
    return entry;
  }

  async function removeEntry(id: string) {
    await deleteRecord(id);
    setEntries((current) => current.filter((item) => item.id !== id));
  }

  return {
    entries,
    loading,
    error,
    refresh,
    addEntry,
    editEntry,
    removeEntry,
  };
}