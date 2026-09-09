import { createClient } from "@/lib/supabase/client";
import { Client } from "../types";

type ClientRow = {
  id: string;
  organization_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function mapClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? "",
    email: row.email ?? "",
    address: row.address ?? "",
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getClients(): Promise<Client[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapClient);
}

export async function createClientRecord(
  client: Omit<Client, "id" | "createdAt" | "updatedAt">
): Promise<Client> {
  const supabase = createClient();

  const { data: organizationId, error: organizationError } =
    await supabase.rpc("get_user_organization_id");

  if (organizationError) {
    throw new Error(organizationError.message);
  }

  if (!organizationId) {
    throw new Error("No workspace found for the current user.");
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({
      organization_id: organizationId,
      name: client.name,
      phone: client.phone || null,
      email: client.email || null,
      address: client.address || null,
      notes: client.notes || null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapClient(data);
}

export async function updateClient(
  id: string,
  client: Partial<Client>
): Promise<Client> {
  const supabase = createClient();

  const updateData: Record<string, unknown> = {};

  if (client.name !== undefined) {
    updateData.name = client.name;
  }

  if (client.phone !== undefined) {
    updateData.phone = client.phone || null;
  }

  if (client.email !== undefined) {
    updateData.email = client.email || null;
  }

  if (client.address !== undefined) {
    updateData.address = client.address || null;
  }

  if (client.notes !== undefined) {
    updateData.notes = client.notes || null;
  }

  const { data, error } = await supabase
    .from("clients")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapClient(data);
}

export async function deleteClient(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}