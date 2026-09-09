"use client";

import { useState } from "react";

import { PageContainer } from "@/components/design-system/PageContainer";
import { PageHeader } from "@/components/design-system/PageHeader";

import { ClientToolbar } from "@/features/clients/components/ClientToolbar";
import { ClientTable } from "@/features/clients/components/ClientTable";

import { useClients } from "@/features/clients/hooks/useClients";
import { Client } from "@/features/clients/types";

export default function ClientsPage() {
  const [search, setSearch] = useState("");

  const {
    clients,
    loading,
    createClient,
    editClient,
    removeClient,
  } = useClients();

  async function handleEditClient(
    id: string,
    data: Partial<Client>
  ): Promise<void> {
    await editClient(id, data);
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      client.phone
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      client.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <PageContainer>
        <PageHeader
          title="Clients"
          description="Manage your event clients and their information."
        />

        <p className="text-muted-foreground">
          Loading clients...
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        description="Manage your event clients and their information."
      />

      <ClientToolbar
        search={search}
        onSearchChange={setSearch}
        onCreateClient={createClient}
      />

      <ClientTable
        clients={filteredClients}
        onEdit={handleEditClient}
        onDelete={removeClient}
      />
    </PageContainer>
  );
}