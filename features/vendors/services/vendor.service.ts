
import { createClient } from "@/lib/supabase/client";
import type { Vendor, VendorFormValues } from "../types";

type VendorRow = {
  id: string;
  organization_id: string;
  name: string;
  category: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  website: string | null;
  notes: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
};

function mapVendor(row: VendorRow): Vendor {
  return {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    category: row.category,
    contactPerson: row.contact_person ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    website: row.website ?? "",
    notes: row.notes ?? "",
    rating: row.rating === null ? null : Number(row.rating),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDatabase(values: VendorFormValues) {
  return {
    name: values.name.trim(),
    category: values.category,
    contact_person: values.contactPerson || null,
    phone: values.phone || null,
    email: values.email || null,
    address: values.address || null,
    city: values.city || null,
    website: values.website || null,
    notes: values.notes || null,
    rating: values.rating ?? null,
  };
}

export async function getVendors(): Promise<Vendor[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return ((data ?? []) as VendorRow[]).map(mapVendor);
}

export async function createVendor(
  values: VendorFormValues
): Promise<Vendor> {
  const supabase = createClient();

  const { data: organizationId, error: organizationError } =
    await supabase.rpc("get_user_organization_id");

  if (organizationError) throw new Error(organizationError.message);
  if (!organizationId) throw new Error("No workspace found for the current user.");

  const { data, error } = await supabase
    .from("vendors")
    .insert({
      organization_id: organizationId,
      ...toDatabase(values),
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapVendor(data as VendorRow);
}

export async function updateVendor(
  id: string,
  values: VendorFormValues
): Promise<Vendor> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("vendors")
    .update(toDatabase(values))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapVendor(data as VendorRow);
}

export async function deleteVendor(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("vendors")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
