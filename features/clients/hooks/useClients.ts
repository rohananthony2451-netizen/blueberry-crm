"use client";

import { useEffect, useState } from "react";

import {
  getClients,
  createClientRecord,
  updateClient,
  deleteClient as deleteClientService,
} from "../services/client.service";

import { Client } from "../types";
import type { ClientFormValues } from "../validation";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients();
        setClients(data);
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, []);

  async function createClient(
    client: ClientFormValues
  ) {
    const newClient = await createClientRecord({
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address ?? "",
      notes: client.notes ?? "",
    });

    setClients((current) => [
      newClient,
      ...current,
    ]);

    return newClient;
  }

  async function editClient(
    id: string,
    client: Partial<Client>
  ) {
    const updatedClient = await updateClient(
      id,
      client
    );

    setClients((current) =>
      current.map((item) =>
        item.id === id
          ? updatedClient
          : item
      )
    );

    return updatedClient;
  }

  async function removeClient(
    id: string
  ): Promise<void> {
    await deleteClientService(id);

    setClients((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }

  return {
    clients,
    loading,
    createClient,
    editClient,
    removeClient,
  };
}