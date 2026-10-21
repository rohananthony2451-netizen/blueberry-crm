"use client";

import { useEffect, useState } from "react";

import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";

import { ClientToolbar } from "@/features/clients/components/ClientToolbar";
import { ClientTable } from "@/features/clients/components/ClientTable";

import { useClients } from "@/features/clients/hooks/useClients";
import { useEvents } from "@/features/events/hooks/useEvents";
import { getPendingPayments } from "@/features/payments/services/payment.service";

import type { Client } from "@/features/clients/types";
import type { PendingPaymentItem } from "@/features/payments/types";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

export default function ClientsPage() {
const [search, setSearch] = useState("");
const [pendingPayments, setPendingPayments] =
useState<PendingPaymentItem[]>([]);
const [paymentsLoading, setPaymentsLoading] = useState(true);
const [userRole, setUserRole] = useState<string | null>(null);

const {
clients,
loading: clientsLoading,
createClient,
editClient,
removeClient,
} = useClients();

const {
events,
loading: eventsLoading,
error: eventsError,
} = useEvents();

useEffect(() => {
let active = true;

async function loadUserRole() {
  try {
    const supabase = createSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      if (active) setUserRole(null);
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!active) return;

    if (error) {
      console.error("Failed to load user role:", error);
      setUserRole(null);
      return;
    }

    setUserRole(profile?.role ?? null);
  } catch (error) {
    console.error("Failed to load user role:", error);
    if (active) setUserRole(null);
  }
}

void loadUserRole();

return () => {
  active = false;
};

}, []);

useEffect(() => {
let active = true;

async function loadPendingPayments() {
  try {
    const data = await getPendingPayments();

    if (active) {
      setPendingPayments(data);
    }
  } catch (error) {
    console.error(
      "Failed to load client outstanding balances:",
      error
    );
  } finally {
    if (active) {
      setPaymentsLoading(false);
    }
  }
}

void loadPendingPayments();

return () => {
  active = false;
};

}, []);

async function handleEditClient(
id: string,
data: Partial<Client>
): Promise<void> {
await editClient(id, data);
}

const filteredClients = clients.filter((client) => {
const query = search.toLowerCase();

return (
  client.name.toLowerCase().includes(query) ||
  client.phone.toLowerCase().includes(query) ||
  client.email.toLowerCase().includes(query)
);

});

const loading =
clientsLoading || eventsLoading || paymentsLoading;

const canDeleteRecords = userRole === "admin";

return (
<PageContainer>
<div className="[&>div>div>h1]:text-[28px] [&>div>div>h1]:leading-9">
<PageHeader
       title="Clients"
       description="Manage your event clients and their information."
     />
</div>

  <ClientToolbar
    search={search}
    onSearchChange={setSearch}
    onCreateClient={createClient}
  />

  {eventsError ? (
    <p className="mb-3 text-sm text-red-600">
      Event information could not be loaded. Please refresh the page to try again.
    </p>
  ) : null}

  {loading ? (
    <p className="py-6 text-sm text-slate-500">
      Loading client information...
    </p>
  ) : (
    <ClientTable
      clients={filteredClients}
      events={events}
      pendingPayments={pendingPayments}
      onEdit={handleEditClient}
      onDelete={canDeleteRecords ? removeClient : undefined}
      canDelete={canDeleteRecords}
    />
  )}
</PageContainer>

);
}