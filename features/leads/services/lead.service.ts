import { createClient } from "@/lib/supabase/client";
import { Lead } from "../types";

type LeadRow = {
  id: string;
  organization_id: string;
  client_name: string;
  phone: string | null;
  event_type: string;
  event_date: string | null;
  budget: number | string | null;
  source: string | null;
  status: string;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
function parseBudget(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const normalized = value.replace(/[₹,\s]/g, "");
  const number = Number(normalized);

  return Number.isFinite(number) ? number : null;
}

function mapLead(row: LeadRow): Lead {
  return {
    id: row.id,
    clientName: row.client_name,
    phone: row.phone ?? "",
    eventType: row.event_type,
    eventDate: row.event_date ?? "",
    budget: row.budget?.toString() ?? "",
    source: row.source as Lead["source"],
    status: row.status as Lead["status"],
    assignedTo: row.assigned_to ?? "",
    notes: row.notes ?? "",
  };
}

export async function getLeads(): Promise<Lead[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapLead);
}

export async function createLead(
  lead: Omit<Lead, "id">
): Promise<Lead> {
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
    .from("leads")
    .insert({
      organization_id: organizationId,
      client_name: lead.clientName,
      phone: lead.phone || null,
      event_type: lead.eventType,
      event_date: lead.eventDate || null,
      budget: parseBudget(lead.budget),
      source: lead.source || null,
      status: lead.status,
      assigned_to: lead.assignedTo || null,
      notes: lead.notes || null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapLead(data);
}

export async function updateLead(
  id: string,
  lead: Partial<Lead>
): Promise<Lead> {
  const supabase = createClient();

  const updateData: Record<string, unknown> = {};

  if (lead.clientName !== undefined) {
    updateData.client_name = lead.clientName;
  }

  if (lead.phone !== undefined) {
    updateData.phone = lead.phone || null;
  }

  if (lead.eventType !== undefined) {
    updateData.event_type = lead.eventType;
  }

  if (lead.eventDate !== undefined) {
    updateData.event_date = lead.eventDate || null;
  }

  if (lead.budget !== undefined) {
    updateData.budget = parseBudget(lead.budget);
  }

  if (lead.source !== undefined) {
    updateData.source = lead.source || null;
  }

  if (lead.status !== undefined) {
    updateData.status = lead.status;
  }

  if (lead.assignedTo !== undefined) {
    updateData.assigned_to = lead.assignedTo || null;
  }

  if (lead.notes !== undefined) {
    updateData.notes = lead.notes || null;
  }

  const { data, error } = await supabase
    .from("leads")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapLead(data);
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}