
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createVendor as createVendorRecord,
  deleteVendor as deleteVendorRecord,
  getVendors,
  updateVendor as updateVendorRecord,
} from "../services/vendor.service";
import type { Vendor, VendorFormValues } from "../types";

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setVendors(await getVendors());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load vendors.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function addVendor(values: VendorFormValues) {
    const vendor = await createVendorRecord(values);
    setVendors((current) =>
      [...current, vendor].sort((a, b) => a.name.localeCompare(b.name))
    );
    return vendor;
  }

  async function editVendor(id: string, values: VendorFormValues) {
    const vendor = await updateVendorRecord(id, values);
    setVendors((current) =>
      current.map((item) => item.id === id ? vendor : item)
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    return vendor;
  }

  async function removeVendor(id: string) {
    await deleteVendorRecord(id);
    setVendors((current) => current.filter((item) => item.id !== id));
  }

  return { vendors, loading, error, refresh, addVendor, editVendor, removeVendor };
}
